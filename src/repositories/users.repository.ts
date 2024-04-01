import { UsersEntity } from "../entities";

import { BaseRepository } from "./base.repository";

export class UsersRepository extends BaseRepository<UsersEntity> {
  count(): Promise<number> {
    return this.model.count({});
  }

  public async isUserExistsWithSameEmail(email: string): Promise<UsersEntity> {
    return this.model.findOne({ where: { email } });
  }

  public async getByUsername(username: string): Promise<UsersEntity> {
    return this.model.findOne({ where: { username } });
  }

  public async getUserByEmail(email: string): Promise<UsersEntity> {
    return this.model.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  public async getUserById(id: number): Promise<UsersEntity> {
    return this.model.findOne({ where: { id } });
  }
}
