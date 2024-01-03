import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Res,
  UseFilters,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../../middleware/err.Middleware';
import { Response } from 'express';
import { ApplicationsService } from '../services/applications.service';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { data as mockApplicants } from '../../../mockdata';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('applications')
@ApiInternalServerErrorResponse({ description: 'Server is down' })
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}
  @Post('')
  @ApiTags('create an applicant')
  @ApiOperation({
    description: 'creating an applicant associated with a specific role',
  })
  @UseFilters(new HttpExceptionFilter())
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: any /* Express.Multer.File */,
    @Body() application: CreateApplicationDto,
    @Res() res: Response,
  ) {
    const { roleId, jobId, status, ...rest } = application;
    application.roleId;
    // for (let i = 0; i < mockApplicants.length; i++) {// for testing purposes only
    const result = await this.applicationsService.create({
      roleId,
      jobId,
      status,
      file,
      ...rest,
    });
    const { job } = result;
    return res.json({ jobId: job.id });
  }
  //
  @Get(':id')
  @ApiTags('Get applicant')
  @ApiOperation({
    description: 'Get a single applicant by id',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.applicationsService.findOne(id);
    return res.json(result);
  }
  @Patch(':id')
  @ApiTags('Get applicant')
  @ApiOperation({
    description: 'Get a single applicant by id',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  async update(
    @Param('id') id: string,
    @Body() body: { status: CreateApplicationDto['status'] },

    @Res() res: Response,
  ) {
    const result = await this.applicationsService.update(id, body.status);
    return res.json(result);
  }
  @Get('/all/:roleid')
  @ApiTags('Get applicants')
  @ApiOperation({
    description: 'Get all applicants related to a specifi role',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  async findAll(@Res() res: Response, @Param('roleid') roleId: string) {
    const result = await this.applicationsService.findAll(roleId);
    return res.json(result);
  }
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.applicationsService.remove(id);
    return res.json(result);
  }
  @Delete()
  async bulkRemove(@Body() ids: string[], @Res() res: Response) {
    const result = await this.applicationsService.bulkremove(ids);
    return res.json(result);
  }
}
