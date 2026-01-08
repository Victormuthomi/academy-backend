import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Create a new user (trainee or trainer)
   * Hashes password before saving
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      isActive: createUserDto.role === UserRole.TRAINER, // Trainers active by default
    });

    return user.save();
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * ✅ Get all trainees
   */
  async getTrainees(): Promise<User[]> {
    return this.userModel.find({ role: UserRole.TRAINEE }).exec();
  }

  /**
   * ✅ Activate a trainee
   */
  async activateTrainee(traineeId: string): Promise<User> {
    const trainee = await this.userModel.findById(traineeId);
    if (!trainee) throw new NotFoundException('Trainee not found');

    trainee.isActive = true;
    return trainee.save();
  }

  /**
   * ✅ Update trainee profile (skills, projects, institution, phone)
   */
  async updateProfile(userId: string, body: any): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Only allow updating specific fields
    if (body.skills) user.skills = body.skills;
    if (body.projects) user.projects = body.projects;
    if (body.institution) user.institution = body.institution;
    if (body.phone) user.phone = body.phone;

    return user.save();
  }
}
