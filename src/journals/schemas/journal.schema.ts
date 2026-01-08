import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

  // ✅ Updated comments to include trainer reference + comment + timestamp
  @Prop({
    type: [
      {
        trainer: { type: Types.ObjectId, ref: 'Trainer' },
        comment: String,
        createdAt: Date,
      },
    ],
    default: [],
  })
  comments: {
    trainer: Types.ObjectId;
    comment: string;
    createdAt: Date;
  }[];

  @Prop({ required: true })
  date: Date;
}

// ✅ Document type
export type JournalDocument = Journal & Document;

// ✅ Schema
export const JournalSchema = SchemaFactory.createForClass(Journal);
