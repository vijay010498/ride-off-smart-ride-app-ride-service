import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DriverRideDocument } from './driver-ride.schema';
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
    this.logger.log('rideRequestDto', rideRequestDto, user);
    return 'Ride Created';
  }
}
