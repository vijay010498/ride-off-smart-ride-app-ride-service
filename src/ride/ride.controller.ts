import {
  Body,
  Controller,
  Get,
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
  ApiResponse,
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
import { DriverRideDto } from './dtos/driver-ride.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { IsSignedUpGuard } from '../common/guards/isSignedUp.guard';
import { RiderService } from '../rider/rider.service';
import { RiderRideDto } from './dtos/rider-ride.dto';
import { CreateRiderRideRequestDto } from '../common/dtos/create-rider-ride-request.dto';

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
  constructor(
    private readonly driverService: DriverService,
    private readonly riderService: RiderService,
  ) {}

  @Get('/driver')
  @ApiOperation({
    summary: 'Get User Driver Rides',
  })
  @ApiResponse({
    description: 'Get Driver Rides',
    type: [DriverRideDto],
  })
  @Serialize(DriverRideDto)
  getUserDriverRides(@CurrentUser() user: UserDocument) {
    return this.driverService.getRides(user);
  }
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
    type: DriverRideDto,
  })
  @Serialize(DriverRideDto)
  createDriverRide(
    @Body() body: CreateDriverRideRequestDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.driverService.createRide(body, user);
  }

  @Post('/rider')
  @ApiOperation({
    summary: 'Create a Ride as Rider / Passenger',
  })
  @ApiCreatedResponse({
    description: 'Ride Created',
    type: RiderRideDto,
  })
  @Serialize(RiderRideDto)
  createRiderRide(
    @Body() body: CreateRiderRideRequestDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.riderService.createRide(body, user);
  }
}
