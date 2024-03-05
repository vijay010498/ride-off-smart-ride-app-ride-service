import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RiderRideDocument } from './rider-ride-schema';
import { CreateRiderRideRequestDto } from '../common/dtos/create-rider-ride-request.dto';
import { UserDocument } from '../common/schemas/user.schema';
import { LocationService } from '../location/location.service';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { GeoJSONType } from '../driver/driver-ride.schema';

@Injectable()
export class RiderService {
  private readonly logger = new Logger(RiderService.name);

  constructor(
    @InjectModel('RiderRide')
    private readonly riderRideCollection: Model<RiderRideDocument>,
    private readonly locationService: LocationService,
  ) {}

  async getRides(user: UserDocument) {
    return this.riderRideCollection
      .find({
        userId: user.id,
      })
      .exec();
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
      return riderRide.save();
    } catch (error) {
      if (error instanceof UnprocessableEntityException) rethrow(error);

      this.logger.error('createRide-error', error);
      throw new InternalServerErrorException('Server Error, Please try later');
    }
  }
}
