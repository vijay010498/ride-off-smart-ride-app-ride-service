import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DriverRideScheme } from './driver-ride.schema';
import { UserVehicleSchema } from '../common/schemas/user-vehicle.schema';
import { LocationModule } from '../location/location.module';
import { SnsModule } from '../sns/sns.module';
import { MyConfigModule } from '../my-config/my-config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'DriverRide',
        schema: DriverRideScheme,
      },
      {
        name: 'UserVehicle',
        schema: UserVehicleSchema,
      },
    ]),
    MyConfigModule,
    LocationModule,
    SnsModule,
  ],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}
