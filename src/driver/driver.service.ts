import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DriverRideDocument, GeoJSONType } from './driver-ride.schema';
import { Model } from 'mongoose';
import { UserVehicleDocument } from '../common/schemas/user-vehicle.schema';
import { CreateDriverRideRequestDto } from '../common/dtos/create-driver-ride-request.dto';
import { UserDocument } from '../common/schemas/user.schema';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);

  constructor(
    @InjectModel('DriverRide')
    private readonly driverRideCollection: Model<DriverRideDocument>,
    @InjectModel('UserVehicle')
    private readonly userVehicleCollection: Model<UserVehicleDocument>,
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
    const { vehicleId } = rideRequestDto;
    const vehicle = await this.userVehicleCollection.findOne({
      _id: vehicleId,
      userId: user.id,
    });

    if (!vehicle)
      throw new UnprocessableEntityException(
        'Vehicle Not Found, Please Create new Vehicle',
      );

    // create new ride
    const driverRide = new this.driverRideCollection({
      userId: user.id,
      origin: {
        type: GeoJSONType.Point,
        coordinates: [
          rideRequestDto.originLongitude,
          rideRequestDto.originLatitude,
        ],
      },
      destination: {
        type: GeoJSONType.Point,
        coordinates: [
          rideRequestDto.destinationLongitude,
          rideRequestDto.destinationLatitude,
        ],
      },
      leaving: rideRequestDto.leaving,
      vehicleId: rideRequestDto.vehicleId,
      luggage: rideRequestDto.luggage,
      emptySeats: rideRequestDto.emptySeats,
      seatPrice: rideRequestDto.seatPrice,
      tripDescription: rideRequestDto.tripDescription,
    });
    return driverRide.save();
  }
}
