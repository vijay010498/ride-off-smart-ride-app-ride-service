import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
  constructor(private readonly configService: ConfigService) {}
  getMongoUri(): string {
    return this.configService.get<string>('MONGODB_URI_RIDE');
  }

  getMongoDatabase(): string {
    return this.configService.get<string>('MONGO_RIDE_DATABASE');
  }

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  getAWSSQSAccessID(): string {
    return this.configService.get<string>('aws_sqs_access_key_id');
  }

  getAWSSQSSecretKey(): string {
    return this.configService.get<string>('aws_sqs_secret_access_key');
  }

  getDefaultAwsRegion(): string {
    return this.configService.get<string>('aws_region_default');
  }

  getSqsQueueName(): string {
    return this.configService.get<string>('aws_sqs_queue_name');
  }

  getSqsQueueURL(): string {
    return this.configService.get<string>('aws_sqs_queue_url');
  }

  getAWSSNSAccessID(): string {
    return this.configService.get<string>('aws_sns_access_key_id');
  }

  getAWSSNSSecretKey(): string {
    return this.configService.get<string>('aws_sns_secret_access_key');
  }

  getRideTopicSNSArn(): string {
    return this.configService.get<string>('RIDE_TOPIC_SNS_ARN');
  }

  getGoogleMapsGeocodeKey(): string {
    return this.configService.get<string>('google_maps_geocode_Key');
  }

  getGoogleMapsPlacesKey(): string {
    return this.configService.get<string>('google_maps_place_key');
  }
  getGoogleMapsRoutesKey(): string {
    return this.configService.get<string>('google_maps_routes_key');
  }

  getAverageFuelCost(): string {
    return this.configService.get<string>('AVG_FUEL_COST');
  }
}
