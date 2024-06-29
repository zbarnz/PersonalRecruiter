import { EntitySchema } from "typeorm";
import { JobBoard } from "./JobBoard.entity";

export const JobBoardSchema = new EntitySchema<JobBoard>({
  name: JobBoard.name,
  target: JobBoard,
  tableName: "job_board",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    name: {
      type: String,
      unique: true,
    },
  },
});
