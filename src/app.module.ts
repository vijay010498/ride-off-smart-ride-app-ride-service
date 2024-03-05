import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MyConfigModule } from './my-config/my-config.module';
import { MyConfigService } from './my-config/my-config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SqsModule } from './sqs/sqs.module';
import { SqsProcessorModule } from './sqs_processor/sqs_processor.module';
import { DriverModule } from './driver/driver.module';
import { RiderModule } from './rider/rider.module';
import { RideModule } from './ride/ride.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { SnsModule } from './sns/sns.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    CacheModule.register({
      isGlobal: true, // So we don't need to register in each module
    }),
    DevtoolsModule.registerAsync({
      imports: [MyConfigModule],
      useFactory: (configService: MyConfigService) => ({
        http: configService.getNodeEnv() !== 'production',
      }),
      inject: [MyConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [MyConfigModule],
      useFactory: (configService: MyConfigService) => ({
        uri: configService.getMongoUri(),
        dbName: configService.getMongoDatabase(),
        autoIndex: true,
      }),
      inject: [MyConfigService],
    }),
    SqsModule,
    SqsProcessorModule,
    DriverModule,
    RiderModule,
    RideModule,
    TokenModule,
    UserModule,
    LocationModule,
    SnsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
