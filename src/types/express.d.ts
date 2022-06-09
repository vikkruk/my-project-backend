import { UserDocument } from '../models/user-model';

declare global {
  declare namespace Express {
    export interface Request {
      tokenData?: {
        email: string,
        role: string,
      },
      authUserDoc: UserDocument
    }
  }
}

export { };
