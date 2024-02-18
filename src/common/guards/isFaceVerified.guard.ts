import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class IsFaceVerifiedGuard implements CanActivate {
  private readonly logger = new Logger(IsFaceVerifiedGuard.name);

  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const userId = request.user?.sub;

      if (!userId) return false;

      const user = await this.userService.findById(userId);

      if (user && user.faceIdVerified) return true;

      throw new UnprocessableEntityException(
        'Please Verify Id to create this ride',
      );
    } catch (error) {
      if (error instanceof UnprocessableEntityException) rethrow(error);
      this.logger.log('Error in IsFaceVerifiedGuard', error);
      return false;
    }
  }
}
