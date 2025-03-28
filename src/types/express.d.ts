declare namespace Express {
    export interface Request {
      user: any; // Ajout de la propriété `user`
    }
  }

  declare global {
    namespace Express {
      interface Request {
        user?: { id_account: string; role: string };
      }
    }
  }   