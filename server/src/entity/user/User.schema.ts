import { EntitySchema } from "typeorm";

import { User } from "./User.entity";

export const UserSchema = new EntitySchema<User>({
  name: User.name,
  target: User,
  tableName: "user",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    email: {
      type: "varchar",
    },
    phone: {
      type: "varchar",
      nullable: true,
    },
    createdAt: {
      name: "created_at",
      type: Date,
      createDate: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    hash: {
      type: "varchar",
      select: false,
    },
    salt: {
      type: "varchar",
      select: false,
    },
    verified: {
      type: Boolean,
      default: 0,
    },
  },
});
