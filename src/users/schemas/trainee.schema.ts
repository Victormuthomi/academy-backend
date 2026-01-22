import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TraineeDocument = Trainee & Document;

@Schema({ timestamps: true })
export class Trainee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ required: true })
  role: 'trainee';

  @Prop()
  phone?: string;

  @Prop()
  institution?: string;

  @Prop({ default: '' })
  admNo: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  projects: string[];
}

export const TraineeSchema = SchemaFactory.createForClass(Trainee);
