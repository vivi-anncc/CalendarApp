import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  getEvents(userId: number) {
  return this.prisma.event.findMany({
    where: {
      userId,
    },
    orderBy: {
      startTime: 'asc',
    },
  });
}


createEvent(
  userId: number,
  eventData: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    location?: string;
  },
) {
  return this.prisma.event.create({
    data: {
      ...eventData,
      userId,
    },
  });
}


  async deleteEvent(id: number, userId: number) {
  const event = await this.prisma.event.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!event) {
    return undefined;
  }

  return this.prisma.event.delete({
    where: { id },
  });
}




async updateEvent(
  id: number,
  userId: number,
  eventData: UpdateEventDto,
) {
  const event = await this.prisma.event.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!event) {
    return undefined;
  }

  return this.prisma.event.update({
    where: { id },
    data: {
      ...eventData,
      ...(eventData.startTime && {
        startTime: new Date(eventData.startTime),
      }),
      ...(eventData.endTime && {
        endTime: new Date(eventData.endTime),
      }),
    },
  });
}


}
