import { EntitySchema } from "typeorm";

import { Phone } from "./Phone.entity";
import { User } from "../user/User.entity";

export const PhoneSchema = new EntitySchema<Phone>({
  name: Phone.name,
  target: Phone,
  tableName: "phone",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    number: {
      type: "varchar",
    },
    verification_code: {
      type: Number,
    },
    expiration: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: User.name,
      joinColumn: {
        name: "user",
      },
    },
  },
});
