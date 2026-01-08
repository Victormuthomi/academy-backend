import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Enum for user roles
 */
export enum UserRole {
  TRAINER = 'trainer',
  TRAINEE = 'trainee',
}

/**
 * User Schema
 * Represents a Trainer or a Trainee
 */
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // hashed password

  @Prop({ required: true })
  role: UserRole;

  @Prop()
  phone?: string;

  @Prop()
  institution?: string;

  @Prop()
  admNo?: string;

  @Prop({ default: false })
  isActive: boolean; // Trainer activates account

  @Prop({ type: [String], default: [] })
  skills: string[]; // Skills learnt by trainee

  @Prop({ type: [String], default: [] })
  projects: string[]; // Project names or IDs

  @Prop({ default: Date.now })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
