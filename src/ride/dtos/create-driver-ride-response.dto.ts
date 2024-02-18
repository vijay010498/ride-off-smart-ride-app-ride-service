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
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
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
