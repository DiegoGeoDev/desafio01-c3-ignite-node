import { getRepository, Repository } from "typeorm";

import { IFindUserByFullNameDTO, IFindUserWithGamesDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return await this.repository.findOneOrFail(
      { id: user_id },
      { relations: ["games"] }
    );
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY first_name ASC");
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(
      "SELECT * FROM users WHERE LOWER(first_name) LIKE LOWER($1) AND LOWER(last_name) LIKE LOWER($2)",
      [first_name, last_name]
    );
  }
}
