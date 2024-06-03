import { EntitySchema } from "typeorm";
import { Listing } from "../listing/Listing.entity";
import { User } from "../user/User.entity";
import { GPTLog } from "./GPTLog.entity";

export const GPTLogSchema = new EntitySchema<GPTLog>({
  name: GPTLog.name,
  target: GPTLog,
  tableName: "gpt_log",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    input: {
      type: "text",
    },
    response: {
      type: "json",
      nullable: true,
    },
    error: {
      type: "text",
      nullable: true,
    },
    promptTokens: {
      type: "int",
      name: "prompt_tokens",
      nullable: true,
    },
    completionTokens: {
      type: "int",
      name: "completion_tokens",
      nullable: true,
    },
    model: {
      type: "text",
      nullable: true,
    },
    failedFlag: {
      type: "boolean",
      default: false,
    },
    batchId: {
      type: "bigint",
      name: "batch_id",
      nullable: true,
    },
    prevAttemptId: {
      type: "int",
      name: "prev_attempt_id",
      nullable: true,
    },
    createdAt: {
      type: "timestamptz",
      name: "created_at",
      nullable: true,
      createDate: true,
    },
    systemFlag: {
      type: "boolean",
      name: "system_flag",
      default: false,
    },
  },
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
      nullable: true,
    },
  },
});
