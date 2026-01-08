import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JournalDocument = Journal & Document;

@Schema({ timestamps: true })
export class Journal {
  @Prop({ type: Types.ObjectId, ref: 'Trainee', required: true })
  trainee: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  githubLink?: string;

  @Prop({ type: [String], default: [] })
  comments: string[];

  @Prop({ required: true })
  date: Date;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
