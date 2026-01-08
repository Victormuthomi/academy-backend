import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class HealthService {
  /**
   * Checks server and MongoDB health
   * @returns {Promise<{server: string; db: string; message?: string}>}
   */
  async check() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      return {
        server: 'ok',
        db: 'error',
        message: 'MONGO_URI not defined in .env',
      };
    }

    try {
      // Create a temporary MongoClient to ping the DB
      const client = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 3000,
      });
      await client.connect(); // immediately tries to connect
      await client.db().command({ ping: 1 }); // ping the DB
      await client.close(); // close after check

      return { server: 'ok', db: 'ok' };
    } catch (err: any) {
      return { server: 'ok', db: 'error', message: err.message };
    }
  }
}
