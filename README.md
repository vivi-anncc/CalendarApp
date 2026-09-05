# CalendarApp

I wanted to build a project that I could actually use in my day-to-day life while also giving me the opportunity to learn and practice a full range of software development skills. I chose the concept of a calendar application because it is useful to me, but still simple enough in scope that I can focus on understanding how the different parts of an application work together.

This project is primarily a learning project where I am gaining hands-on experience with**Next.js, React, TypeScript, REST APIs, and Prisma**. I wanted to work on something that would involve both frontend and backend development rather than focusing on only one area.

The application allows users to create, view, update, and delete calendar events through a REST API. I am using the project to learn more about API design, database integration, validation, application structure, and how frontend and backend systems communicate with each other.

My goal is to use it as an opportunity to learn new technologies and develop a better understanding of how a full-stack application is designed and built from the ground up.


## Tech Stack

- Prisma
- PostgreSQL
- TypeScript
- Node.js
- NestJS
- class-validator
- class-transformer

## Features

- Create, view, update, and delete calendar events
- RESTful API endpoints
- Request and input validation
- Type-safe backend development
- Database integration with Prisma
- Separation of responsibilities between controllers and services
- Modular backend architecture

## Project Structure

```text
calendar-app-api/
│
├── src/
│   ├── events/
│   │   ├── dto/
│   │   │   ├── create-event.dto.ts
│   │   │   └── update-event.dto.ts
│   │   │
│   │   ├── event.ts
│   │   ├── events.controller.ts
│   │   ├── events.module.ts
│   │   └── events.service.ts
│   │
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
│
├── package.json
├── package-lock.json
└── README.md
