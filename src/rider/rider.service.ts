import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RiderRideDocument, RiderRideStatus } from './rider-ride-schema';
import { CreateRiderRideRequestDto } from '../common/dtos/create-rider-ride-request.dto';
import { UserDocument } from '../common/schemas/user.schema';
import { LocationService } from '../location/location.service';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { GeoJSONType } from '../driver/driver-ride.schema';
import { SnsService } from '../sns/sns.service';

@Injectable()
export class RiderService {
  private readonly logger = new Logger(RiderService.name);

  constructor(
    @InjectModel('RiderRide')
    private readonly riderRideCollection: Model<RiderRideDocument>,
    private readonly locationService: LocationService,
    private readonly snsService: SnsService,
  ) {}

  async getRides(user: UserDocument) {
    return this.riderRideCollection
      .find({
        userId: user.id,
      })
      .exec();
  }

  async cancelRide(rideId: mongoose.Types.ObjectId, user: UserDocument) {
    const canceledRide = await this.riderRideCollection.findOneAndUpdate(
      {
        _id: rideId,
        userId: user.id,
      },
      {
        status: RiderRideStatus.cancelled,
      },
      {
        new: true,
      },
    );

    if (!canceledRide) throw new BadRequestException('Invalid Ride');

    // SNS Event
    this.snsService.publishRiderRideCancelledEvent(canceledRide);

    return canceledRide;
  }
  async createRide(
    rideRequestDto: CreateRiderRideRequestDto,
    user: UserDocument,
  ) {
    try {
      const fromPlaceDetails = await this.locationService.getPlaceDetails(
        rideRequestDto.fromPlaceId,
      );
      const toPlaceDetails = await this.locationService.getPlaceDetails(
        rideRequestDto.toPlaceId,
      );

      if (!fromPlaceDetails || !Object.keys(fromPlaceDetails).length) {
        throw new UnprocessableEntityException('Invalid From Location');
      }

      if (!toPlaceDetails || !Object.keys(toPlaceDetails).length) {
        throw new UnprocessableEntityException('Invalid To Location');
      }

      // create new Rider Ride
      const riderRide = new this.riderRideCollection({
        userId: user.id,
        from: {
          type: GeoJSONType.Point,
          coordinates: [fromPlaceDetails.longitude, fromPlaceDetails.latitude],
        },
        to: {
          type: GeoJSONType.Point,
          coordinates: [toPlaceDetails.longitude, toPlaceDetails.latitude],
        },
        fromAddress: fromPlaceDetails.address,
        toAddress: toPlaceDetails.address,
        fromPlaceId: rideRequestDto.fromPlaceId,
        toPlaceId: rideRequestDto.toPlaceId,
        fromUrl: fromPlaceDetails.url,
        toUrl: toPlaceDetails.url,
        fromName: fromPlaceDetails.name,
        toName: toPlaceDetails.name,
        fromPostalCode: fromPlaceDetails.postalCode,
        toPostalCode: toPlaceDetails.postalCode,
        fromCountryShortName: fromPlaceDetails.countryShortName,
        toCountryShortName: toPlaceDetails.countryShortName,
        fromCountryLongName: fromPlaceDetails.countryLongName,
        toCountryLongName: toPlaceDetails.countryLongName,
        fromProvinceShortName: fromPlaceDetails.provinceShortName,
        toProvinceShortName: toPlaceDetails.provinceShortName,
        fromProvinceLongName: fromPlaceDetails.provinceLongName,
        toProvinceLongName: toPlaceDetails.provinceLongName,
        departing: rideRequestDto.departing,
        seats: rideRequestDto.seats,
        maxPrice: rideRequestDto.maxPrice,
        rideDescription: rideRequestDto.rideDescription,
      });
      const ride = await riderRide.save();

      // SNS Event
      this.snsService.publishNewRiderRideCreatedEvent(ride);
      return ride;
    } catch (error) {
      if (error instanceof UnprocessableEntityException) rethrow(error);

      this.logger.error('createRide-error', error);
      throw new InternalServerErrorException('Server Error, Please try later');
    }
  }
}
