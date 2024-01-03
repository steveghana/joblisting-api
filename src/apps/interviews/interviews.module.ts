import { Module } from '@nestjs/common';
import { InterviewsService } from './services/interviews.service';
import { InterviewsController } from './controllers/interviews.controller';

@Module({
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
