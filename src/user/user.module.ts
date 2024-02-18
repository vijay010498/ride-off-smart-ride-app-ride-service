import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserTokenBlacklistSchema } from '../common/schemas/user-token-blacklist.schema';
import { UserSchema } from '../common/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

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
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
