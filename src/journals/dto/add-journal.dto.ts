import { IsString, IsOptional, IsDateString } from 'class-validator';

export class AddJournalDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  githubLink?: string;

  @IsOptional()
  @IsDateString()
  date: string; // YYYY-MM-DD
}
