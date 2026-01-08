import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { JournalsService } from '../journals/journals.service';
import { UsersService } from '../users/users.service';
import { AddJournalDto } from '../journals/dto/add-journal.dto';

@Controller('trainee')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('trainee')
export class TraineeController {
  constructor(
    private readonly journalsService: JournalsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Trainee Dashboard
   * Returns user profile + journal summary
   */
  @Get('dashboard')
  async getDashboard(@Req() req: any) {
    const userId = req.user.userId;

    // Get profile
    const trainee = await this.usersService.findById(userId);
    if (!trainee) {
      throw new NotFoundException('Trainee not found');
    }

    // Get journals
    const journals = await this.journalsService.getJournalsForTrainee(userId);

    return {
      trainee: {
        _id: trainee._id.toString(),
        name: trainee.name,
        email: trainee.email,
        phone: trainee.phone ?? '',
        institution: trainee.institution ?? '',
        admNo: trainee.admNo ?? '',
        skills: trainee.skills ?? [],
        projects: trainee.projects ?? [],
        isActive: trainee.isActive ?? false,
      },
      journalSummary: {
        totalJournals: journals.length,
        lastSubmission: journals.length ? journals[0].date : null,
        journals,
      },
    };
  }

  /**
   * Add a new journal
   */
  @Post('journal')
  async addJournal(@Req() req: any, @Body() body: AddJournalDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const journalDate = new Date(body.date);
    journalDate.setHours(0, 0, 0, 0);

    if (journalDate > today) {
      throw new ForbiddenException('Cannot submit a journal for a future date');
    }

    return this.journalsService.createJournal(req.user.userId, body);
  }

  /**
   * Update trainee profile (skills, projects, institution)
   */
  @Put('profile')
  async updateProfile(
    @Req() req: any,
    @Body()
    body: { skills?: string[]; projects?: string[]; institution?: string },
  ) {
    const updated = await this.usersService.updateProfile(
      req.user.userId,
      body,
    );
    if (!updated) {
      throw new NotFoundException('Trainee not found');
    }
    return updated;
  }
}
