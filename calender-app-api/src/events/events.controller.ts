import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCalendarEvents(@Req() req: any) {
    return this.eventsService.getEvents(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createCalendarEvent(
    @Body() eventData: CreateEventDto,
    @Req() req: any,
  ) {
    return this.eventsService.createEvent(
      req.user.userId,
      {
        ...eventData,
        startTime: new Date(eventData.startTime),
        endTime: new Date(eventData.endTime),
      },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCalendarEvent(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const event = await this.eventsService.deleteEvent(
      Number(id),
      req.user.userId,
    );

    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return event;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateCalendarEvent(
    @Param('id') id: string,
    @Body() eventData: UpdateEventDto,
    @Req() req: any,
  ) {
    const event = await this.eventsService.updateEvent(
      Number(id),
      req.user.userId,
      eventData,
    );

    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return event;
  }
}
