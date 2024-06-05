import { EntitySchema } from "typeorm";
import { AutoApply } from "../auto_apply/AutoApply.entity";
import { User } from "../user/User.entity";
import { PDF } from "./PDF.entity";

export const PDFSchema = new EntitySchema<PDF>({
  name: PDF.name,
  target: PDF,
  tableName: "pdf",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    dateGenerated: {
      type: "timestamptz",
      name: "date_generated",
      nullable: false,
      createDate: true,
    },
    type: {
      type: "text",
      nullable: false,
    },
    pdfData: {
      type: "bytea",
      name: "pdf_data",
      nullable: false,
    },
  },
  relations: {
    autoApply: {
      type: "many-to-one",
      target: AutoApply.name,
      joinColumn: {
        name: "auto_apply",
      },
      nullable: true,
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
