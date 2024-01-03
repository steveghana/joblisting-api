import { Module } from '@nestjs/common';
import { DevelopersService } from '../services/developers.service';
import { DevelopersController } from '../controllers/developers.controller';

@Module({
  controllers: [DevelopersController],
  providers: [DevelopersService],
  exports: [DevelopersService],
})
export class DevelopersModule {}
