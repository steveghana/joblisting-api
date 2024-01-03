import { Module } from '@nestjs/common';
import { ApplicationsService } from './services/applications.service';
import { ApplicationsController } from './controllers/applications.controller';
import { DevelopersModule } from '../developers/tests/developers.module';

@Module({
  imports: [DevelopersModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
