import {
  BadRequestException,
  Body,
  CacheInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UseFilters,
  Res,
  Next,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ShortUrlService } from '../service/short.service';
import { HttpExceptionFilter } from '../../../middleware/err.Middleware';
import { Response } from 'express';
import { RoleShort, Short } from './roleShort.dto';

@Controller('roleshorturl')
export class ShortController {
  constructor(private short: ShortUrlService) {}

  /* ===================== */

  @ApiTags('Get short url for qr code')
  @Get('/')
  @UseFilters(new HttpExceptionFilter())
  @ApiOperation({
    description: 'Get short url for qr code',
  })
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorised user',
        error: 'Unauthorized',
      },
    },
  })
  @ApiOkResponse({
    description: 'Get short url for qr code successfully',
    schema: { example: { isAuthenticate: true, status: 200 } },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  // @UseInterceptors(CacheInterceptor)
  async getShort(@Query() query: Short, @Res() res: Response) {
    const { shortComponent } = query;
    const result = await this.short.resolveShortUrl(shortComponent);
    return res.status(200).json(result);
  }

  /* ===================== */

  /* ===================== */

  /* ===================== */
}
