import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum GeoJSONType {
  Point = 'Point',
}
interface Location {
  type: GeoJSONType;
  coordinates: [number, number]; // [longitude, latitude]
}

export enum LuggageEnum {
  noLuggage = 'NoLuggage',
  small = 'Small',
  medium = 'Medium',
  large = 'Large',
}
@Schema({ timestamps: true, id: true })
export class DriverRide {
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
  origin: Location;

  @Prop({
    type: { type: String, default: GeoJSONType.Point, enum: GeoJSONType }, // GeoJSON type
    coordinates: { type: [Number] }, // [longitude, latitude]
  })
  destination: Location;

  // should include date and time
  @Prop({
    required: true,
    type: Date,
    index: true,
  })
  leaving: Date;

  // TODO add recurring trip
  // TODO Implement Stops
  // TODO Implement ride status
  // TODO Implement ride active

  // vehicle details
  @Prop({
    required: true,
    index: true,
    ref: 'UserVehicle',
    type: mongoose.Types.ObjectId,
  })
  vehicleId: mongoose.Types.ObjectId;

  // Trip Preferences
  @Prop({
    type: String,
    index: true,
    required: true,
    enum: LuggageEnum,
  })
  luggage: LuggageEnum;

  @Prop({
    type: Number,
    required: true,
    index: true,
  })
  emptySeats: number;

  @Prop({
    type: Number,
    required: true,
    index: true,
  })
  seatPrice: number;

  @Prop({
    type: String,
    required: false,
  })
  tripDescription: string;
}

export type DriverRideDocument = DriverRide & Document;

const DriverRideScheme = SchemaFactory.createForClass(DriverRide);

DriverRideScheme.index({
  origin: '2dsphere',
  destination: '2dsphere',
});

export { DriverRideScheme };
