import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { IsFutureDateTime } from './create-driver-ride-request.dto';

export class CreateRiderRideRequestDto {
  @ApiProperty({
    description: 'Ride From - longitude',
  })
  @IsLongitude()
  fromLongitude: number;

  @ApiProperty({
    description: 'Ride From - latitude',
  })
  @IsLatitude()
  fromLatitude: number;

  @ApiProperty({
    description: 'Ride To - longitude',
  })
  @IsLongitude()
  toLongitude: number;

  @ApiProperty({
    description: 'Ride To - latitude',
  })
  @IsLatitude()
  toLatitude: number;

  @ApiProperty({
    description:
      'Ride Departing / Starting Date and Time (YYYY-MM-DD HH:mm AM/PM)',
  })
  @IsFutureDateTime({
    message:
      'Departing date must be in the future in the format YYYY-MM-DD HH:mm AM/PM',
  })
  departing: string;

  @ApiProperty({
    description: 'Total Number of Seats to book',
    minimum: 1,
  })
  @IsInt({ message: 'Seats must be an integer' })
  @Min(1, { message: 'At least 1 empty seat is required' })
  seats: number;

  @ApiPropertyOptional({
    description: 'Max Price for each Seat',
  })
  @IsOptional()
  @IsInt({ message: 'Price must be an integer' })
  @Min(1, { message: "Price can't be negative or Zero" })
  maxPrice: number;

  @ApiPropertyOptional({
    description: 'Ride Description',
  })
  @IsOptional()
  @IsString()
  rideDescription: string;
}
