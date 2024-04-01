import { Sequelize, Op, Transaction } from "sequelize";

import { IWrite, IRead } from "./interfaces";

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  public readonly model: any;
  public readonly sequelize: Sequelize;
  public readonly Op: typeof Op;

  constructor(model: any) {
    this.model = model;
    this.Op = Op;
    this.sequelize = model.sequelize;
  }

  async create(data: any, transaction = {}) {
    return this.model.create(data, { ...transaction });
  }

  async findOne(where, options = {}):Promise<T> {
    return this.model.findOne({ where, ...options });
  }

  async findAll(where?, order = {}, options = {}) {
    return this.model.findAll({ where, ...order, ...options });
  }

  async update(cond, data: any, transaction = {}) {
    return this.model.update(data, {
      where: cond,
      returning: true,
      new: true,
      plain: true,
      ...transaction,
    });
  }

  async delete(id: number): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async findWithPagination(limit: string, offset: string): Promise<T[]> {
    throw new Error("Method not implemented.");
  }

  async upsert(data: any, transaction?: Transaction): Promise<any> {
    const options = {
      returning: true,
      new: true,
      plain: true,
      ...transaction,
    };

    const result: any = await this.model.upsert(data, options);
    return result;
  }
}
