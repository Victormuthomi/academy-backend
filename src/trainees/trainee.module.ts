import { Module } from '@nestjs/common';
import { TraineeController } from './trainee.controller';
import { JournalsModule } from '../journals/journals.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [JournalsModule, UsersModule],
  controllers: [TraineeController],
})
export class TraineeModule {}
