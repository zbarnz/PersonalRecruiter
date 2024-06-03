import { EntitySchema } from "typeorm";
import { AutoApply } from "./AutoApply.entity";
import { User } from "../user/User.entity";
import { Listing } from "../listing/Listing.entity";

export const AutoApplySchema = new EntitySchema<AutoApply>({
  name: AutoApply.name,
  target: AutoApply,
  tableName: "auto_apply",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    dateApplied: {
      name: "date_applied",
      type: "timestamptz",
      createDate: true,
    },
    questionAnswers: {
      name: "question_answers",
      type: "jsonb",
      nullable: true,
    },
    completedFlag: {
      name: "completed_flag",
      type: "boolean",
      default: false,
    },
    failedFlag: {
      name: "failed_flag",
      type: "boolean",
      default: false,
    },
    failedReason: {
      name: "failed_reason",
      type: "varchar",
      nullable: true,
    },
  },
  uniques: [
    {
      columns: ["listing", "user"],
    },
  ],
  relations: {
    listing: {
      type: "many-to-one",
      target: Listing.name,
      joinColumn: {
        name: "listing",
      },
      nullable: true,
    },
    user: {
      type: "many-to-one",
      target: User.name,
      joinColumn: {
        name: "user",
      },
    },
  },
});
