import { CacheModule, Module, Next } from '@nestjs/common';
import { ShortController } from './controllers/short.controller';
import { ShortUrlService } from './service/short.service';

@Module({
  imports: [],
  controllers: [ShortController],
  providers: [ShortUrlService],
})
export class ShortModule {}
