import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class RiderRideDto {
  @ApiProperty()
  @Transform(({ obj }) => obj._id)
  @Expose()
  rideId: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Transform(({ obj }) => obj.from.coordinates[0])
  @Expose()
  fromLongitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.from.coordinates[1])
  @Expose()
  fromLatitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.to.coordinates[0])
  @Expose()
  toLongitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.to.coordinates[1])
  @Expose()
  toLatitude: number;

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
  departing: string;

  @ApiProperty()
  @Expose()
  seats: string;

  @ApiProperty()
  @Expose()
  maxPrice: number;

  @ApiProperty()
  @Expose()
  rideDescription?: string;
}
