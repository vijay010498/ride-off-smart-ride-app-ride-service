import { Module } from '@nestjs/common';
import { RiderService } from './rider.service';

@Module({
  providers: [RiderService],
})
export class RiderModule {}
