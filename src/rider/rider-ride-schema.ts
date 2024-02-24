import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
export enum GeoJSONType {
  Point = 'Point',
}
interface Location {
  type: GeoJSONType;
  coordinates: [number, number]; // [longitude, latitude]
}

@Schema({ timestamps: true, id: true })
export class RiderRide {
  @Prop({
    required: true,
    index: true,
    ref: 'User',
    type: mongoose.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: { type: String, default: GeoJSONType.Point, enum: GeoJSONType }, // GeoJSON type
    coordinates: { type: [Number] }, // [longitude, latitude]
  })
  from: Location;

  @Prop({
    type: { type: String, default: GeoJSONType.Point, enum: GeoJSONType }, // GeoJSON type
    coordinates: { type: [Number] }, // [longitude, latitude]
  })
  to: Location;

  // should include date and time
  @Prop({
    required: true,
    type: Date,
    index: true,
  })
  departing: Date;

  @Prop({
    type: Number,
    required: true,
  })
  seats: number;

  @Prop({
    type: Number,
  })
  maxPrice: number;

  @Prop({
    type: String,
    required: false,
  })
  rideDescription: string;
}

export type RiderRideDocument = RiderRide & Document;
const RiderRideScheme = SchemaFactory.createForClass(RiderRide);

RiderRideScheme.index({
  from: '2dsphere',
  to: '2dsphere',
});

export { RiderRideScheme };
