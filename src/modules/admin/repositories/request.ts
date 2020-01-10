import { Injectable } from '@nestjs/common';
import { IRequest } from 'modules/database/interfaces/request';
import { Request } from 'modules/database/models/request';
import { Transaction } from 'objection';

@Injectable()
export class RequestRepository {
  public async findById(id: number, transaction?: Transaction): Promise<Request> {
    return Request.query(transaction)
      .where({ id })
      .first();
  }

  public async insert(model: IRequest, transaction?: Transaction): Promise<Request> {
    return Request.query(transaction).insert(model);
  }

  public async remove(id: number, transaction?: Transaction): Promise<void> {
    await Request.query(transaction)
      .del()
      .where({ id });
  }

  public async update(model: IRequest, transaction?: Transaction): Promise<Request> {
    return Request.query(transaction).updateAndFetchById(model.id, <Request>model);
  }
}
