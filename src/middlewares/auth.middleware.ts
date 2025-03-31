import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../entities/UserRole";

interface AuthPayload {
  id_account: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authMiddleware = (requiredRole?: UserRole) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      res.status(401).json({ message: "Accès non autorisé, token manquant." });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
      req.user = decoded; // Ajout de `req.user` correctement typé

      // Vérification du rôle seulement si `requiredRole` est défini
      if (requiredRole && req.user.role !== requiredRole) {
        res.status(403).json({ message: "Accès interdit, rôle insuffisant." });
        return;
      }

      next();
    } catch (error) {
      res.status(403).json({ message: "Token invalide." });
    }
  };
};
