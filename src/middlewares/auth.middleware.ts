import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../entities/UserRole';

const authMiddleware = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Vérifier le token dans l'entête Authorization
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Accès non autorisé, token manquant." });
    }

    try {
      // Décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      // Attacher l'utilisateur décodé à la requête
      req.user = decoded;

      // Vérifier le rôle de l'utilisateur selon la route
      if (requiredRole === UserRole.ADMIN && UserRole.ADMIN) {
        return res.status(403).json({ message: "Accès interdit, rôle d'administrateur requis." });
      }

      // Si 'user', tout le monde est autorisé
      if (requiredRole === UserRole.USER && ( req.user.role === UserRole.USER || req.user.role === UserRole.USER)) {
        return next();
      }

      next();
    } catch (error) {
      return res.status(403).json({ message: "Token invalide." });
    }
  };
};

export default authMiddleware;
