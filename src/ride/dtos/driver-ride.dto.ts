import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { VehicleDto } from './vehicle.dto';
import { DriverRideStatus, Stop } from '../../driver/driver-ride.schema';

export class DriverRideDto {
  @ApiProperty()
  @Transform(({ obj }) => obj._id)
  @Expose()
  rideId: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Transform(({ obj }) => obj.origin.coordinates[0])
  @Expose()
  originLongitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.origin.coordinates[1])
  @Expose()
  originLatitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.destination.coordinates[0])
  @Expose()
  destinationLongitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.destination.coordinates[1])
  @Expose()
  destinationLatitude: number;

  @ApiProperty({
    type: [Object],
  })
  @Expose()
  stops: Stop[];

  @ApiProperty()
  @Expose()
  originAddress: number;

  @ApiProperty()
  @Expose()
  destinationAddress: number;

  @ApiProperty()
  @Expose()
  originPlaceId: number;

  @ApiProperty()
  @Expose()
  destinationPlaceId: number;

  @ApiProperty()
  @Expose()
  originUrl: number;

  @ApiProperty()
  @Expose()
  destinationUrl: number;

  @ApiProperty()
  @Expose()
  originName: number;

  @ApiProperty()
  @Expose()
  destinationName: number;

  @ApiProperty()
  @Expose()
  originPostalCode: number;

  @ApiProperty()
  @Expose()
  destinationPostalCode: number;

  @ApiProperty()
  @Expose()
  originCountryShortName: number;

  @ApiProperty()
  @Expose()
  destinationCountryShortName: number;

  @ApiProperty()
  @Expose()
  originCountryLongName: number;

  @ApiProperty()
  @Expose()
  destinationCountryLongName: number;

  @ApiProperty()
  @Expose()
  originProvinceShortName: number;

  @ApiProperty()
  @Expose()
  destinationProvinceShortName: number;

  @ApiProperty()
  @Expose()
  originProvinceLongName: number;

  @ApiProperty()
  @Expose()
  destinationProvinceLongName: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => {
    const date = new Date(value);
    const isoString = date.toISOString();
    const formattedDate = isoString.slice(0, 10);
    const formattedTime = isoString.slice(11, 16);
    const period = Number(formattedTime.slice(0, 2)) < 12 ? 'AM' : 'PM';

    return `${formattedDate} ${formattedTime} ${period}`;
  })
  leaving: string;

  @ApiProperty()
  @Expose()
  totalRideDurationInSeconds: number;

  @ApiProperty()
  @Expose()
  totalRideDistanceInMeters: number;

  @ApiProperty({
    type: String,
    enum: DriverRideStatus,
  })
  @Expose()
  status: DriverRideStatus;

  @ApiProperty()
  @Type(() => VehicleDto)
  @Expose()
  vehicleId: VehicleDto; // TODO convert into vehicle

  @ApiProperty()
  @Expose()
  luggage: string;

  @ApiProperty()
  @Expose()
  emptySeats: string;

  @ApiProperty()
  @Expose()
  tripDescription?: string;
}
