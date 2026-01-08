import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainerController } from './trainer.controller';
import { UsersModule } from '../users/users.module';
import { JournalsModule } from '../journals/journals.module';

@Module({
  imports: [
    UsersModule, // to access trainee data
    JournalsModule, // to access journals
    MongooseModule, // optional if needed here
  ],
  controllers: [TrainerController],
})
export class TrainerModule {}
