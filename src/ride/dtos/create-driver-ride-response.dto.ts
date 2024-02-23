import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CreateDriverRideResponseDto {
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
  vehicleId: string;

  @ApiProperty()
  @Expose()
  luggage: string;

  @ApiProperty()
  @Expose()
  emptySeats: string;

  @ApiProperty()
  @Expose()
  seatPrice: number;

  @ApiProperty()
  @Expose()
  tripDescription?: string;
}
