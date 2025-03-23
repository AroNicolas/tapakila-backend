import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authMiddleware = (requiredRole: 'user' | 'admin' | 'both') => {
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
      if (requiredRole === 'admin' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Accès interdit, rôle d'administrateur requis." });
      }

      if (requiredRole === 'user' && req.user.role !== 'user' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Accès interdit, rôle utilisateur requis." });
      }

      // Si 'both', tout le monde est autorisé
      if (requiredRole === 'both') {
        return next();
      }

      next();
    } catch (error) {
      return res.status(403).json({ message: "Token invalide." });
    }
  };
};

export default authMiddleware;
