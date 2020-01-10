import { IRequest } from 'modules/database/interfaces/request';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { IPaginationParams } from 'modules/common/interfaces/pagination';
import { Request } from 'modules/database/models/request';

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { RequestRepository } from '../repositories/request';
import { Page, Transaction } from 'objection';

@Injectable()
export class RequestService {
  constructor(private requestRepository: RequestRepository) {}

  public async list(
    params: IPaginationParams,
    currentUser: ICurrentUser,
    transaction?: Transaction
  ): Promise<Page<Request>> {
    let query = Request.query(transaction)
      .select('*')
      .where('userId', '=', currentUser.id)
      .page(params.page, params.pageSize);

    if (params.orderBy) {
      if (params.orderBy !== 'description') {
        query = query.orderBy(params.orderBy, params.orderDirection);
      } else {
        query = query.orderBy('description', params.orderDirection).orderBy('description', params.orderDirection);
      }
    }

    return query;
  }

  public async findById(id: number, transaction?: Transaction): Promise<Request> {
    return Request.query(transaction)
      .where({ id })
      .first();
  }

  public async save(model: IRequest, currentUser: ICurrentUser): Promise<IRequest> {
    if (model.id) return this.update(model, currentUser);
    return this.create(model, currentUser);
  }

  public async remove(requestId: number, currentUser: ICurrentUser): Promise<void> {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new NotFoundException('not-found');
    }

    if (request.userId !== currentUser.id) {
      throw new BadRequestException('not-allowed-remove-current-user');
    }

    return this.requestRepository.remove(requestId);
  }

  private async create(model: IRequest, currentUser: ICurrentUser): Promise<IRequest> {
    model.userId = currentUser.id;

    const request = await this.requestRepository.insert(model);

    return request;
  }

  private async update(model: IRequest, currentUser: ICurrentUser): Promise<Request> {
    const request = await this.requestRepository.findById(model.id);

    if (!request) throw new NotFoundException('not-found');

    if (request.userId !== currentUser.id) {
      throw new BadRequestException('not-allowed-remove-current-user');
    }

    return this.requestRepository.update({ ...request, ...model });
  }
}
