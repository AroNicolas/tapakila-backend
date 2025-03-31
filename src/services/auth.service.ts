import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from 'express';
import { Account } from "../entities/Account";
import { AppDataSource } from "../config/database";

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const userRepository = AppDataSource.getRepository(Account);
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) throw new Error("Email déjà utilisé");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({ name, email, password: hashedPassword});
    await userRepository.save(newUser);

    return this.generateToken(newUser);
  }

  static async login(email: string, password: string): Promise<string> {
    // Recherche l'utilisateur dans la bonne entité
    const userRepository = AppDataSource.getRepository(Account);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Mot de passe incorrect");
    }

    // Générer le token avec le rôle et autres informations
    const token = jwt.sign(
      { id: user.id_account, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return token;
  }

  static generateToken(user: Account) {
    return jwt.sign({ id: user.id_account, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
  }
}
