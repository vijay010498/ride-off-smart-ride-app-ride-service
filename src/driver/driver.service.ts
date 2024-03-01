import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DriverRideDocument, GeoJSONType } from './driver-ride.schema';
import { Model } from 'mongoose';
import { UserVehicleDocument } from '../common/schemas/user-vehicle.schema';
import { CreateDriverRideRequestDto } from '../common/dtos/create-driver-ride-request.dto';
import { UserDocument } from '../common/schemas/user.schema';
import { LocationService } from '../location/location.service';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);

  constructor(
    @InjectModel('UserVehicle')
    private readonly userVehicleCollection: Model<UserVehicleDocument>,
    @InjectModel('DriverRide')
    private readonly driverRideCollection: Model<DriverRideDocument>,
    private readonly locationService: LocationService,
  ) {}

  async getRides(user: UserDocument) {
    return this.driverRideCollection
      .find({
        userId: user.id,
      })
      .populate('vehicleId')
      .exec();
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

      const originPlaceDetails = await this.locationService.getPlaceDetails(
        rideRequestDto.originPlaceId,
      );

      const destinationPlaceDetails =
        await this.locationService.getPlaceDetails(
          rideRequestDto.destinationPlaceId,
        );

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
        seatPrice: rideRequestDto.seatPrice,
        tripDescription: rideRequestDto.tripDescription,
      });
      return driverRide.save();
    } catch (error) {
      if (error instanceof UnprocessableEntityException) rethrow(error);

      this.logger.error('createRide-error', error);
      throw new InternalServerErrorException('Server Error, Please try later');
    }
  }
}
