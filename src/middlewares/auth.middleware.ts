import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../entities/UserRole";

export const authMiddleware = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      res.status(401).json({ message: "Accès non autorisé, token manquant." });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id_account: string; role: UserRole };

      req.user = decoded;

      if (requiredRole === UserRole.ADMIN && req.user.role !== UserRole.ADMIN) {
        res.status(403).json({ message: "Accès interdit, rôle d'administrateur requis." });
        return;
      }

      next();
    } catch (error) {
      res.status(403).json({ message: "Token invalide." });
    }
  };
};
