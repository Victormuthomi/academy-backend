import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { UserSchema, UserRole } from '../src/users/schemas/user.schema';
import { JournalSchema } from '../src/journals/schemas/journal.schema';
import { model, Types } from 'mongoose';

// Load environment variables
dotenv.config();

async function testSchemas() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI not defined in .env');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');

    // Models
    const User = model('User', UserSchema);
    const Journal = model('Journal', JournalSchema);

    // --- Create a trainee user ---
    const trainee = new User({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123',
      role: UserRole.TRAINEE,
      phone: '1234567890',
      institution: 'Alcodist Academy',
      admNo: 'ADM001',
      isActive: true,
      skills: ['JavaScript'],
      projects: [],
    });

    const savedTrainee = await trainee.save();
    console.log('✅ Trainee saved:', savedTrainee);

    // --- Create a journal entry for trainee ---
    const journal = new Journal({
      trainee: savedTrainee._id,
      title: 'Learned NestJS Modules',
      description: 'Created a Health module and tested DB connection',
      githubLink: 'https://github.com/johndoe/alcodist-backend',
      comments: [],
      date: new Date(), // today
    });

    const savedJournal = await journal.save();
    console.log('✅ Journal saved:', savedJournal);

    // --- Fetch all journals with trainee info ---
    const journals = await Journal.find().populate('trainee').exec();
    console.log('📖 Journals with trainee info:', journals);

    // Disconnect
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (err: any) {
    console.error('❌ Error during schema test:', err.message);
    process.exit(1);
  }
}

// Run the test
testSchemas();
