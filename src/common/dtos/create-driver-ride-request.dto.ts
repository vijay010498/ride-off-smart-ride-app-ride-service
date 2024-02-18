import {
  registerDecorator,
  ValidationOptions,
  IsMongoId,
  IsEnum,
  IsString,
  IsOptional,
  IsLongitude,
  IsLatitude,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LuggageEnum } from '../../driver/driver-ride.schema';

export class CreateDriverRideRequestDto {
  @ApiProperty({
    description: 'Trip Origin - longitude',
  })
  @IsLongitude()
  originLongitude: number;

  @ApiProperty({
    description: 'Trip Origin - latitude',
  })
  @IsLatitude()
  originLatitude: number;

  @ApiProperty({
    description: 'Trip Destination - longitude',
  })
  @IsLongitude()
  destinationLongitude: number;

  @ApiProperty({
    description: 'Trip Destination - latitude',
  })
  @IsLatitude()
  destinationLatitude: number;

  @ApiProperty({
    description:
      'Trip Leaving / Starting Date and Time (YYYY-MM-DD HH:mm AM/PM)',
  })
  @IsDateTimeString({
    message:
      'Leaving must be a valid date-time string in format YYYY-MM-DD HH:mm AM/PM',
  })
  leaving: string;

  @ApiProperty({
    description: 'Valid Vehicle Id ,You can Create new Vehicle In User Profile',
  })
  @IsMongoId({
    message:
      'Must Be a Valid Vehicle Id ,You can Create new Vehicle In User Profile',
  })
  vehicleId: string;

  @ApiProperty({
    description: 'Luggage Details',
    type: String,
    enum: LuggageEnum,
    default: LuggageEnum.noLuggage,
  })
  @IsEnum(LuggageEnum)
  luggage: string;

  @ApiProperty({
    description: 'Total Number of Empty Seats',
    minimum: 1,
  })
  @IsInt({ message: 'Empty seats must be an integer' })
  @Min(1, { message: 'At least 1 empty seat is required' })
  emptySeats: number;

  @ApiProperty({
    description: 'Price for each Seat',
  })
  @IsInt({ message: 'Price must be an integer' })
  @Min(1, { message: "Price can't be negative or Zero" })
  seatPrice: number;

  @ApiPropertyOptional({
    description: 'Trip Description',
  })
  @IsOptional()
  @IsString()
  tripDescription: string;
}

function IsDateTimeString(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isDateTimeString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const dateTimeRegex =
            /^\d{4}-\d{2}-\d{2} (0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

          if (!dateTimeRegex.test(value)) return false;

          const parsedDate = Date.parse(value);
          return !isNaN(parsedDate);
        },
      },
    });
  };
}
