import mongoose from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

enum VehicleTypeEnum {
  hatchBack = 'Hatchback',
  coupe = 'Coupe',
  convertible = 'Convertible',
  sedan = 'Sedan',
  suv = 'SUV',
  truck = 'Truck',
  stationWagon = 'Station Wagon',
  minivan = 'Minivan',
  van = 'Van',
}

export class UserVehicle {
  @Prop({
    required: true,
    index: true,
    ref: 'User',
    type: mongoose.Types.ObjectId,
  })
  userId: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  model: string;

  @Prop({
    required: true,
    type: VehicleTypeEnum,
    index: true,
  })
  type: VehicleTypeEnum;

  @Prop({
    required: true,
    type: String,
  })
  color: string;

  @Prop({
    required: true,
    type: String,
  })
  year: string;

  @Prop({
    required: true,
    type: String,
  })
  licensePlate: string;

  @Prop({
    required: true,
    type: String,
  })
  photoS3URI: string;

  @Prop({
    required: true,
    type: String,
  })
  photoS3ObjectURL: string;
}

export type UserVehicleDocument = UserVehicle & Document;

export const UserVehicleSchema = SchemaFactory.createForClass(UserVehicle);
