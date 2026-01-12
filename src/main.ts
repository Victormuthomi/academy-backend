import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable DTO validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://academy-frontend-nu-lime.vercel.app',
    ],
    credentials: true, // if you plan to send cookies/auth
  });

  const port = process.env.PORT || 3000;
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    Logger.error('MONGO_URI not defined in .env');
    process.exit(1);
  }

  try {
    // Await MongoDB connection BEFORE starting the server
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // fail fast if unreachable
    });
    Logger.log('✅ MongoDB connected successfully');

    // Start NestJS server only after DB connection
    await app.listen(port);
    Logger.log(`🚀 Server listening on http://localhost:${port}`);
  } catch (err: any) {
    Logger.error('❌ MongoDB connection failed', err.message);
    process.exit(1); // stop server startup
  }
}

bootstrap();
