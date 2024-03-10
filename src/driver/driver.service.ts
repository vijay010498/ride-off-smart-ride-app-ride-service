import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DriverRideDocument,
  DriverRideStatus,
  GeoJSONType,
} from './driver-ride.schema';
import mongoose, { Model } from 'mongoose';
import { UserVehicleDocument } from '../common/schemas/user-vehicle.schema';
import { CreateDriverRideRequestDto } from '../common/dtos/create-driver-ride-request.dto';
import { UserDocument } from '../common/schemas/user.schema';
import { LocationService } from '../location/location.service';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { SnsService } from '../sns/sns.service';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);

  constructor(
    @InjectModel('UserVehicle')
    private readonly userVehicleCollection: Model<UserVehicleDocument>,
    @InjectModel('DriverRide')
    private readonly driverRideCollection: Model<DriverRideDocument>,
    private readonly locationService: LocationService,
    private readonly snsService: SnsService,
  ) {}

  async getRides(user: UserDocument) {
    return this.driverRideCollection
      .find({
        userId: user.id,
      })
      .populate('vehicleId')
      .exec();
  }

  async cancelRide(rideId: mongoose.Types.ObjectId, user: UserDocument) {
    const canceledRide = await this.driverRideCollection.findOneAndUpdate(
      {
        _id: rideId,
        userId: user.id,
      },
      {
        status: DriverRideStatus.cancelled,
      },
      { new: true },
    );

    if (!canceledRide) throw new BadRequestException('Invalid Ride');

    // SNS Event
    this.snsService.publishDriverRideCancelledEvent(canceledRide);
    return canceledRide;
  }

  async createRide(
    rideRequestDto: CreateDriverRideRequestDto,
    user: UserDocument,
  ) {
    try {
      const { vehicleId } = rideRequestDto;
      const vehicle = await this.userVehicleCollection.findOne({
        _id: vehicleId,
        userId: user.id,
      });

      if (!vehicle)
        throw new UnprocessableEntityException(
          'Vehicle Not Found, Please Create new Vehicle',
        );

      const [originPlaceDetails, destinationPlaceDetails] = await Promise.all([
        this.locationService.getPlaceDetails(rideRequestDto.originPlaceId),
        this.locationService.getPlaceDetails(rideRequestDto.destinationPlaceId),
      ]);

      // Get placeDetails for stops
      const stopsPromises = rideRequestDto.stops.map(async (stop) => {
        return this.locationService.getPlaceDetails(stop);
      });

      const stopsDetails = await Promise.all(stopsPromises);

      const stops = stopsDetails.map((stop) => {
        return {
          address: stop.address,
          longitude: stop.longitude,
          latitude: stop.latitude,
          url: stop.url,
          name: stop.name,
          postalCode: stop.postalCode,
          countryShortName: stop.countryShortName,
          countryLongName: stop.countryLongName,
          provinceShortName: stop.provinceShortName,
          provinceLongName: stop.provinceLongName,
          placeId: stop.placeId,
        };
      });

      // TODO add estimation reach time and all
      if (!originPlaceDetails || !Object.keys(originPlaceDetails).length) {
        throw new UnprocessableEntityException('Invalid Origin Location');
      }

      if (
        !destinationPlaceDetails ||
        !Object.keys(destinationPlaceDetails).length
      ) {
        throw new UnprocessableEntityException('Invalid Destination  Location');
      }
      // create new ride
      const driverRide = new this.driverRideCollection({
        userId: user.id,
        origin: {
          type: GeoJSONType.Point,
          coordinates: [
            originPlaceDetails.longitude,
            originPlaceDetails.latitude,
          ],
        },
        destination: {
          type: GeoJSONType.Point,
          coordinates: [
            destinationPlaceDetails.longitude,
            destinationPlaceDetails.latitude,
          ],
        },
        stops,
        originAddress: originPlaceDetails.address,
        destinationAddress: destinationPlaceDetails.address,
        originPlaceId: rideRequestDto.originPlaceId,
        destinationPlaceId: rideRequestDto.destinationPlaceId,
        originUrl: originPlaceDetails.url,
        destinationUrl: destinationPlaceDetails.url,
        originName: originPlaceDetails.name,
        destinationName: destinationPlaceDetails.name,
        originPostalCode: originPlaceDetails.postalCode,
        destinationPostalCode: destinationPlaceDetails.postalCode,
        originCountryShortName: originPlaceDetails.countryShortName,
        destinationCountryShortName: destinationPlaceDetails.countryShortName,
        originCountryLongName: originPlaceDetails.countryLongName,
        destinationCountryLongName: destinationPlaceDetails.countryLongName,
        originProvinceShortName: originPlaceDetails.provinceShortName,
        destinationProvinceShortName: destinationPlaceDetails.provinceShortName,
        originProvinceLongName: originPlaceDetails.provinceLongName,
        destinationProvinceLongName: destinationPlaceDetails.provinceLongName,
        leaving: rideRequestDto.leaving,
        vehicleId: rideRequestDto.vehicleId,
        luggage: rideRequestDto.luggage,
        emptySeats: rideRequestDto.emptySeats,
        tripDescription: rideRequestDto.tripDescription,
      });
      const ride = await driverRide.save();

      // SNS Event
      this.snsService.publishNewDriverRideCreatedEvent(ride);

      return ride;
    } catch (error) {
      if (error instanceof UnprocessableEntityException) rethrow(error);

      this.logger.error('createRide-error', error);
      throw new InternalServerErrorException('Server Error, Please try later');
    }
  }
}
