import { Module } from '@nestjs/common';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';
import { DriverModule } from '../driver/driver.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DriverModule, UserModule],
  controllers: [RideController],
  providers: [RideService],
})
export class RideModule {}
