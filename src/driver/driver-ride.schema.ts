import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
export enum GeoJSONType {
  Point = 'Point',
}
interface Location {
  type: GeoJSONType;
  coordinates: [number, number]; // [longitude, latitude]
}

enum LuggageEnum {
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
    required: true,
    type: { type: String, default: GeoJSONType.Point, enum: GeoJSONType }, // GeoJSON type
    coordinates: { type: [Number] }, // [longitude, latitude]
  })
  origin: Location;

  @Prop({
    required: true,
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

  // vehicle details
  @Prop({
    required: true,
    index: true,
    ref: 'UserVehicle',
    type: mongoose.Types.ObjectId,
  })
  vehicle: mongoose.Types.ObjectId;

  // Trip Preferences
  @Prop({
    type: LuggageEnum,
    index: true,
    required: true,
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
