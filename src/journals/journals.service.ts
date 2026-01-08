import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Journal, JournalDocument } from './schemas/journal.schema';
import { AddJournalDto } from './dto/add-journal.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Injectable()
export class JournalsService {
  constructor(
    @InjectModel(Journal.name) private journalModel: Model<JournalDocument>,
  ) {}

  // ✅ Create a journal
  async createJournal(traineeId: string, dto: AddJournalDto): Promise<Journal> {
    const journal = new this.journalModel({
      trainee: traineeId,
      title: dto.title,
      description: dto.description,
      githubLink: dto.githubLink,
      date: dto.date,
      comments: [], // initialize empty
    });
    return journal.save();
  }

  // ✅ Get all journals for a trainee
  async getJournalsForTrainee(traineeId: string) {
    return this.journalModel
      .find({ trainee: traineeId })
      .sort({ date: -1 })
      .exec();
  }

  // ✅ Add comment from trainer
  async addComment(
    journalId: string,
    trainerId: string,
    dto: AddCommentDto,
  ): Promise<Journal> {
    const journal = await this.journalModel.findById(journalId);
    if (!journal) throw new NotFoundException('Journal not found');

    journal.comments.push({
      trainer: new Types.ObjectId(trainerId),
      comment: dto.comment,
      createdAt: new Date(),
    });

    return journal.save();
  }
}
