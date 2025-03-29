import { AppDataSource } from "../../config/database";
import { Account } from "../../entities/Account";
import { UserRole } from "../../entities/UserRole";

export class AccountService {
  static async getAllUsers(page: number, limit: number) {
    return await AppDataSource.getRepository(Account)
      .createQueryBuilder("account")
      .orderBy("account.name", "ASC")
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  static async getUserByName(name: string) {
    return await AppDataSource.getRepository(Account)
      .createQueryBuilder("user")
      .where("LOWER(user.name) LIKE LOWER(:name)", { name: `%${name}%` })
      .getOne();
  }

  static async setUserRole(id: string, role: UserRole) {
    const userRepository = AppDataSource.getRepository(Account);
    const user = await userRepository.findOne({ where: { id_account: id } });

    if (!user) return null;

    user.role = role;
    await userRepository.save(user);
    return user;
  }
}
