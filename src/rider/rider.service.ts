import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RiderRideDocument } from './rider-ride-schema';
import { CreateRiderRideRequestDto } from '../common/dtos/create-rider-ride-request.dto';
import { UserDocument } from '../common/schemas/user.schema';

@Injectable()
export class RiderService {
  private readonly logger = new Logger(RiderService.name);

  constructor(
    @InjectModel('RiderRide')
    private readonly riderRideCollection: Model<RiderRideDocument>,
  ) {}

  async createRide(
    rideRequestDto: CreateRiderRideRequestDto,
    user: UserDocument,
  ) {
    this.logger.log('Create-Rider-Ride', rideRequestDto, user);
    return 'Ride Created';
  }
}
