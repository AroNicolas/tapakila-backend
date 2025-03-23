import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const token = await AuthService.register(name, email, password);
      res.json({ token });
    } catch (error: Error | any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.json({ token });
    } catch (error: Error | any) {
      res.status(401).json({ message: error.message });
    }
  }
}
