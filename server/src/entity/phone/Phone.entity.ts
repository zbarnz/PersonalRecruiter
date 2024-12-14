import { User } from "../user/User.entity";

export class Phone {
  id: number;
  number: string;
  verification_code: number;
  expiration: Date;
  verified: boolean;
  user: User;

  constructor() {}
}
