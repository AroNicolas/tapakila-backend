import { AppDataSource } from "../../config/database";
import { Account } from "../../entities/Account";
import { UserRole } from "../../entities/UserRole";

export class AccountService {
  static async getAllUsersFiltered(page: number, limit: number, name?: string) {
    const query = AppDataSource.getRepository(Account)
      .createQueryBuilder("account")

    if (name) query.where("LOWER(account.name) LIKE LOWER(:name)", { name: `%${name}%` });

    const [accounts, total] = await query.orderBy("account.name", "ASC").skip((page - 1) * limit).take(limit).getManyAndCount();  // getManyAndCount renvoie [data, totalCount]
    return [accounts, total];
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
