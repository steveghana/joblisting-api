import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Res,
} from '@nestjs/common';
import { InterviewsService } from '../services/interviews.service';
import { CreateInterviewDto, addCommentDto } from '../dto/create-interview.dto';
import { UpdateInterviewDto } from '../dto/update-interview.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../../middleware/err.Middleware';
import { Response } from 'express';
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @ApiTags('creat interview')
  @ApiOperation({
    description: 'create a new interview',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  public async create(
    @Body() createInterviewDto: CreateInterviewDto,
    @Res() res: Response,
  ) {
    const result = await this.interviewsService.create(createInterviewDto);
    return res.status(200).json(result);
  }
  @Post('/addComment')
  @ApiTags('creat interview')
  @ApiOperation({
    description: 'create a new interview',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  public async adComment(
    @Body() addComment: addCommentDto,
    @Res() res: Response,
  ) {
    const result = await this.interviewsService.addComment(addComment);
    return res.status(200).json(result);
  }

  @Get()
  @ApiTags('get interviews')
  @ApiOperation({
    description: 'Get all interviews',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  public async findAll(@Res() res: Response) {
    const result = await this.interviewsService.findAll();
    return res.status(200).json(result);
  }

  @Get(':id')
  @ApiTags('get interview')
  @ApiOperation({
    description: 'Get an interview',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  public async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.interviewsService.findOne(id);
    return res.status(200).json(result);
  }

  @Patch(':id')
  @ApiTags('Update interview')
  @ApiOperation({
    description: 'Update an interview',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  public async update(
    @Param('id') id: string,
    @Body() updateInterviewDto: UpdateInterviewDto,
    @Res() res: Response,
  ) {
    const result = await this.interviewsService.update(id, updateInterviewDto);
    return res.status(200).json(result);
  }

  @Delete(':id')
  @ApiTags('Delete interview')
  @ApiOperation({
    description: 'Delete an interview',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.interviewsService.cancel(id);
    return res.status(200).json(result);
  }
}
