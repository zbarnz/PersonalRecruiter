import { EntitySchema } from "typeorm";
import { Listing } from "../listing/Listing.entity";
import { User } from "../user/User.entity";
import { Exception } from "./Exception.entity";

export const ExceptionSchema = new EntitySchema<Exception>({
  name: Exception.name,
  target: Exception,
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    dateUpdated: {
      type: "timestamptz",
      name: "date_updated",
      updateDate: true,
      createDate: true,
    },
    reason: {
      type: "text",
      nullable: false,
    },
  },
  relations: {
    listing: {
      type: "many-to-one",
      target: Listing.name,
      joinColumn: {
        name: "listing",
      },
      nullable: false,
    },
    user: {
      type: "many-to-one",
      target: User.name,
      joinColumn: {
        name: "user",
      },
      nullable: false,
    },
  },
});
