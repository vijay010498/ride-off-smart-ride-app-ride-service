import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DriverService } from '../driver/driver.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
import { TokenBlacklistGuard } from '../common/guards/tokenBlacklist.guard';
import { IsFaceVerifiedGuard } from '../common/guards/isFaceVerified.guard';
import { CreateDriverRideRequestDto } from '../common/dtos/create-driver-ride-request.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserDocument } from '../common/schemas/user.schema';
import { CreateDriverRideResponseDto } from './dtos/create-driver-ride-response.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { IsSignedUpGuard } from '../common/guards/isSignedUp.guard';

@ApiBearerAuth()
@ApiTags('RIDES')
@ApiForbiddenResponse({
  description: 'User is blocked',
})
@ApiUnauthorizedResponse({
  description: 'Invalid Token',
})
@ApiBadRequestResponse({
  description: 'User Does not exist / User Should be SignedUp to get Verified',
})
@Controller('rides')
@UseInterceptors(CurrentUserInterceptor)
@UseGuards(
  AccessTokenGuard,
  IsBlockedGuard,
  IsSignedUpGuard,
  TokenBlacklistGuard,
)
export class RideController {
  constructor(private readonly driverService: DriverService) {}

  @Post('/driver')
  @UseGuards(IsFaceVerifiedGuard)
  @ApiOperation({
    summary: 'Create a Ride as Driver',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Please Verify Id to create this ride / Vehicle Not Found, Please Create new Vehicle',
  })
  @ApiCreatedResponse({
    description: 'Ride Created',
    type: CreateDriverRideResponseDto,
  })
  @Serialize(CreateDriverRideResponseDto)
  createDriverRide(
    @Body() body: CreateDriverRideRequestDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.driverService.createRide(body, user);
  }
}
