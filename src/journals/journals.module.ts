import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JournalsService } from './journals.service';
import { Journal, JournalSchema } from './schemas/journal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
  ],
  providers: [JournalsService],
  exports: [JournalsService], // <-- export so other modules (Trainer, Trainee) can use it
})
export class JournalsModule {}
