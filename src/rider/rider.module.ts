import { Module } from '@nestjs/common';
import { RiderService } from './rider.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RiderRideScheme } from './rider-ride-schema';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'RiderRide',
        schema: RiderRideScheme,
      },
    ]),
    LocationModule,
  ],
  providers: [RiderService],
  exports: [RiderService],
})
export class RiderModule {}
