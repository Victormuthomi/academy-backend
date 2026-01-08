import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JournalsService } from '../journals/journals.service';
import { UsersService } from '../users/users.service';
import { AddCommentDto } from '../journals/dto/add-comment.dto';

@Controller('trainer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('trainer')
export class TrainerController {
  constructor(
    private readonly journalsService: JournalsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Get all trainees
   */
  @Get('trainees')
  async getAllTrainees() {
    return this.usersService.getTrainees();
  }

  /**
   * Activate a trainee account
   */
  @Post('activate/:traineeId')
  async activateTrainee(@Param('traineeId') traineeId: string) {
    return this.usersService.activateTrainee(traineeId);
  }

  /**
   * Get all journals for a specific trainee
   */
  @Get('journals/:traineeId')
  async getTraineeJournals(@Param('traineeId') traineeId: string) {
    return this.journalsService.getJournalsForTrainee(traineeId);
  }

  /**
   * Add a comment to a journal
   */
  @Post('journals/:journalId/comment')
  async addComment(
    @Param('journalId') journalId: string,
    @Body() body: AddCommentDto,
    @Req() req: any, // req.user is injected by JwtAuthGuard
  ) {
    const trainerId = req.user.userId;
    return this.journalsService.addComment(journalId, trainerId, body);
  }

  /**
   * Trainer Dashboard
   * Returns all trainees with summary of their journals:
   * - total journals submitted
   * - last submission date
   */
  @Get('dashboard')
  async getDashboard() {
    // Get all trainees
    const trainees = await this.usersService.getTrainees();

    // Build dashboard summary for each trainee
    const dashboard = await Promise.all(
      trainees.map(async (trainee) => {
        // Convert ObjectId to string for service method
        const traineeId = trainee._id.toString();

        const journals =
          await this.journalsService.getJournalsForTrainee(traineeId);

        return {
          trainee: {
            _id: trainee._id,
            name: trainee.name,
            email: trainee.email,
            phone: trainee.phone,
            institution: trainee.institution,
            admNo: trainee.admNo,
            skills: trainee.skills,
            projects: trainee.projects,
            isActive: trainee.isActive,
          },
          journalSummary: {
            totalJournals: journals.length,
            lastSubmission: journals.length ? journals[0].date : null,
          },
        };
      }),
    );

    return dashboard;
  }
}
