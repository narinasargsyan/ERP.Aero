export interface IRead<T> {
  findAll(id: number): Promise<T[]>;
  findOne(id: number): Promise<T>;
  findWithPagination(limit: string, offset: string): Promise<T[]>;
}
