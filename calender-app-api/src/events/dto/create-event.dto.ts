import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}

