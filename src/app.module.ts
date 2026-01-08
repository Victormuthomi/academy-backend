import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { TrainerModule } from './trainers/trainer.module';
import { TraineeModule } from './trainees/trainee.module';
import { JournalsModule } from './journals/journals.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Use async to ensure ConfigService is ready
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    UsersModule,
    HealthModule,
    AuthModule,
    JournalsModule,
    TrainerModule,
    TraineeModule,
  ],
})
export class AppModule {}
