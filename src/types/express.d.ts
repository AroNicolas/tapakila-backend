import { Account } from "../entities/Account";

declare global {
  namespace Express {
    interface Request {
      user?: Account | { id_account: string; role: string };
    }
  }
}
