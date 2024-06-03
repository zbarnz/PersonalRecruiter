import { AvailableTemplates } from "resume-lite";
import { EntitySchema } from "typeorm";
import { User } from "../user/User.entity";
import { UserApplicantConfig } from "./UserApplicantConfig.entity";

export const UserApplicantConfigSchema = new EntitySchema<UserApplicantConfig>({
  name: UserApplicantConfig.name,
  target: UserApplicantConfig,
  tableName: "user_applicant_config",
  columns: {
    id: { type: "int", primary: true, generated: true },
    firstName: {
      type: "text",
      name: "first_name",
      nullable: true,
    },
    lastName: {
      type: "text",
      name: "last_name",
      nullable: true,
    },
    email: {
      type: "text",
      name: "email",
      nullable: true,
    },
    phone: {
      type: "text",
      name: "phone",
      nullable: true,
    },
    address: {
      type: "text",
      name: "address",
      nullable: true,
    },
    summary: {
      type: "text",
      name: "summary",
      nullable: true,
    },
    links: {
      type: "json",
      name: "links",
      nullable: true,
    },
    workExperience: {
      type: "json",
      name: "work_experience",
      nullable: true,
    },
    education: {
      type: "json",
      name: "education",
      nullable: true,
    },
    projects: {
      type: "json",
      name: "projects",
      nullable: true,
    },
    certifications: {
      type: "json",
      name: "certifications",
      nullable: true,
    },
    languages: {
      type: "json",
      name: "languages",
      nullable: true,
    },
    volunteerWork: {
      type: "json",
      name: "volunteer_work",
      nullable: true,
    },
    website: {
      type: "text",
      nullable: true,
    },
    skills: {
      type: "text",
      array: true,
      default: () => "'{}'",
    },
    customResumeFlag: {
      type: "boolean",
      name: "custom_resume_flag",
      default: true,
    },
    summarizedResume: {
      type: "text",
      name: "summarized_resume",
      nullable: true,
    },
    preferredResume: {
      type: "enum",
      enum: AvailableTemplates,
      name: "preferred_resume",
      default: AvailableTemplates.STACK,
    },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: User.name,
      joinColumn: {
        name: "user",
      },
      nullable: false,
    },
  },
});
