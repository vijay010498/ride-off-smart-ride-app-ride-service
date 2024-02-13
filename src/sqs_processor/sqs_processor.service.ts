import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../common/schemas/user.schema';
import { UserTokenBlacklistDocument } from '../common/schemas/user-token-blacklist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Events } from '../common/enums/events.enums';
import { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsProcessorService {
  private readonly logger = new Logger(SqsProcessorService.name);

  constructor(
    @InjectModel('User') private readonly userCollection: Model<UserDocument>,
    @InjectModel('UserTokenBlacklist')
    private readonly UserTokenBlacklistCollection: Model<UserTokenBlacklistDocument>,
  ) {}

  async ProcessSqsMessage(messages: Message[]) {
    try {
      await Promise.all(
        messages.map(({ Body }) => {
          try {
            const parsedBody = JSON.parse(Body);
            if (parsedBody.Message) {
              // Message sent by SNS
              const parsedMessage = JSON.parse(parsedBody.Message);
              if (parsedMessage['EVENT_TYPE']) {
                return this._handleMessageEventsSentBySNS(parsedMessage);
              }
            }
          } catch (error) {
            this.logger.error('Error Parsing SQS message:', error);
            throw error;
          }
        }),
      );
    } catch (error) {
      this.logger.error('Error processing SQS messages:', error);
      throw error;
    }
  }

  private async _handleMessageEventsSentBySNS(parsedMessage: any) {
    const { EVENT_TYPE, user, userId, token, updatedUser } = parsedMessage;
    this.logger.log(
      '_handleMessageEventsSentBySNS',
      EVENT_TYPE,
      user,
      userId,
      token,
      updatedUser,
    );
    switch (EVENT_TYPE) {
      case Events.userCreatedByPhone:
        return this._handleUserCreationByPhone(user, userId);
      case Events.tokenBlackList:
        return this._handleTokenBlackListEvent(token);
      case Events.userUpdated:
        return this._handleUserUpdatedEvent(updatedUser, userId);
      default:
        this.logger.warn(`Unhandled event type: ${EVENT_TYPE}`);
        break;
    }
  }

  private async _handleUserCreationByPhone(
    receivedUserObject: any,
    userId: string,
  ) {
    try {
      // check if user already exists
      const existingUser = await this.userCollection.findById(userId);
      if (existingUser) throw new Error('User With Given Id already exists');
      const user = new this.userCollection({ ...receivedUserObject });
      await user.save();

      return user;
    } catch (error) {
      this.logger.error('_handleUserCreationByPhone-error', error);
      throw error;
    }
  }

  private async _handleTokenBlackListEvent(token: string) {
    try {
      const blackListToken = new this.UserTokenBlacklistCollection({
        token,
      });
      await blackListToken.save();
    } catch (error) {
      this.logger.error('_handleTokenBlackListEvent - error', error);
      throw error;
    }
  }

  private async _handleUserUpdatedEvent(updatedUser: any, userId: string) {
    try {
      await this.userCollection
        .findByIdAndUpdate(userId, updatedUser, { new: true })
        .exec();
    } catch (error) {
      this.logger.error('Error handleUserUpdatedEvent', error);
      throw error;
    }
  }
}
