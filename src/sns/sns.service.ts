import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';
import { MyConfigService } from '../my-config/my-config.service';
import { DriverRideDocument } from '../driver/driver-ride.schema';
import { Events } from '../common/enums/events.enums';
import { RiderRideDocument } from '../rider/rider-ride-schema';

@Injectable()
export class SnsService {
  private readonly logger = new Logger(SnsService.name);
  private readonly SNS: SNSClient;

  constructor(private readonly configService: MyConfigService) {
    this.SNS = new SNSClient({
      apiVersion: 'latest',
      region: this.configService.getDefaultAwsRegion(),
      credentials: {
        accessKeyId: this.configService.getAWSSNSAccessID(),
        secretAccessKey: this.configService.getAWSSNSSecretKey(),
      },
    });
  }

  private async _publishToRideTopicARN(Message: string, groupId: string) {
    try {
      const messageParams = {
        Message,
        TopicArn: this.configService.getRideTopicSNSArn(),
        MessageGroupId: groupId,
      };

      const { MessageId } = await this.SNS.send(
        new PublishCommand(messageParams),
      );
      this.logger.log('_publishToRideTopicARN-success', MessageId);
    } catch (_publishToRideTopicARNError) {
      this.logger.error(
        '_publishToRideTopicARNError',
        _publishToRideTopicARNError,
      );
    }
  }

  async publishNewDriverRideCreatedEvent(driverRide: DriverRideDocument) {
    const snsMessage = {
      driverRide,
      EVENT_TYPE: Events.newDriverRideCreated,
    };

    return this._publishToRideTopicARN(
      JSON.stringify(snsMessage),
      driverRide.id,
    );
  }

  async publishNewRiderRideCreatedEvent(riderRide: RiderRideDocument) {
    const snsMessage = {
      riderRide,
      EVENT_TYPE: Events.newRiderRideCreated,
    };

    return this._publishToRideTopicARN(
      JSON.stringify(snsMessage),
      riderRide.id,
    );
  }

  async publishDriverRideCancelledEvent(
    cancelledDriverRide: DriverRideDocument,
  ) {
    const snsMessage = {
      cancelledDriverRide,
      EVENT_TYPE: Events.driverRideCancelled,
    };

    return this._publishToRideTopicARN(
      JSON.stringify(snsMessage),
      cancelledDriverRide.id,
    );
  }

  async publishRiderRideCancelledEvent(cancelledRiderRide: RiderRideDocument) {
    const snsMessage = {
      cancelledRiderRide,
      EVENT_TYPE: Events.riderRideCancelled,
    };

    return this._publishToRideTopicARN(
      JSON.stringify(snsMessage),
      cancelledRiderRide.id,
    );
  }
}
