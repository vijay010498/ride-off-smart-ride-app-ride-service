import { Module } from '@nestjs/common';
import { SqsProcessorService } from './sqs_processor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../common/schemas/user.schema';
import { UserTokenBlacklistSchema } from '../common/schemas/user-token-blacklist.schema';
import { UserVehicleSchema } from '../common/schemas/user-vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'UserTokenBlacklist',
        schema: UserTokenBlacklistSchema,
      },
      {
        name: 'UserVehicle',
        schema: UserVehicleSchema,
      },
    ]),
  ],
  providers: [SqsProcessorService],
  exports: [SqsProcessorService],
})
export class SqsProcessorModule {}
