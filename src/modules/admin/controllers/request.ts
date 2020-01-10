import { Body, Controller, Post, Get, Delete, Put, Query, ParseIntPipe, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ICurrentUser } from 'modules/common/interfaces/currentUser';

import { Request } from 'modules/database/models/request';
import { AuthRequired, CurrentUser } from 'modules/common/guards/token';

import { RequestService } from '../services/request';

import { ListValidator } from '../validators/request/list';
import { SaveValidator } from '../validators/request/save';

@ApiTags('Admin: Auth')
@Controller('/requests')
@AuthRequired()
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get()
  @ApiResponse({ status: 200, type: [Request] })
  public async list(@Query() model: ListValidator, @CurrentUser() currentUser: ICurrentUser) {
    return this.requestService.list(model, currentUser);
  }

  @Post()
  @ApiResponse({ status: 200, type: Request })
  public async save(@Body() model: SaveValidator, @CurrentUser() currentUser: ICurrentUser) {
    return this.requestService.save(model, currentUser);
  }

  @Get(':requestId')
  @ApiResponse({ status: 200, type: Request })
  public async details(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.requestService.findById(requestId);
  }

  @Delete(':requestId')
  public async delete(@Param('requestId', ParseIntPipe) requestId: number, @CurrentUser() currentUser: ICurrentUser) {
    return this.requestService.remove(requestId, currentUser);
  }
}
