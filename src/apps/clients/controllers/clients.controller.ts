import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ClientsService } from '../services/clients.service';
import { ClientFormDataDto } from '../dto/create-client.dto';
import { IClientFormData } from '../../../types/client';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../../middleware/err.Middleware';

@Controller('client')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiTags('creat client')
  @ApiOperation({
    description: 'create a new client',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  async create(
    @Body() createClientDto: ClientFormDataDto,
    @Res() res: Response,
  ) {
    const result = await this.clientsService.create(createClientDto);
    return res.json(result);
  }

  @Get()
  @ApiTags('get clients')
  @ApiOperation({
    description: 'get all existing clients',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  async findAll(@Res() res: Response) {
    const result = await this.clientsService.findAll();
    return res.status(200).send(result);
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.clientsService.findOne(id);
    return res.status(200).send(result);
  }

  @Patch(':id')
  @ApiTags('update client')
  @ApiOperation({
    description: 'update a client',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: Partial<IClientFormData['Client info']>,
    @Res() res: Response,
  ) {
    const result = await this.clientsService.update(id, updateClientDto);
    return res.status(200).send(result);
  }

  @Delete(':id')
  @ApiTags('dlt client')
  @ApiOperation({
    description: 'delete a client from the db',
  })
  @UseFilters(new HttpExceptionFilter())
  @ApiBadRequestResponse({ description: 'Bad Request something went wrong' })
  @ApiInternalServerErrorResponse({ description: 'Server is down' })
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
    @Body() roleIds: string[],
  ) {
    const result = await this.clientsService.remove(id, roleIds);
    return res.status(200).json(result);
  }
}
