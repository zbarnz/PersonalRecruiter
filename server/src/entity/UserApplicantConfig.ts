import {
  OneToOne,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  JoinColumn,
} from "typeorm";

import {
  AvailableTemplates,
  TemplateName,
  Link,
  WorkExperience,
  Education,
  Project,
  Certification,
  Language,
  VolunteerWork,
} from "resume-lite";

import { User } from "./User";

@Entity()
export class UserApplicantConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User)
  @JoinColumn({ name: "user" })
  user: User;

  @Column({ name: "first_name", nullable: true })
  firstName: string;

  @Column({ name: "last_name", nullable: true })
  lastName: string;

  @Column({ name: "email", nullable: true })
  email: string;

  @Column({ name: "phone", nullable: true })
  phone: string;

  @Column({ name: "address", nullable: true })
  address: string;

  @Column({ name: "summary", nullable: true })
  summary: string;

  @Column({ name: "links", nullable: true, type: "json" })
  links: Link[];

  @Column({ name: "work_experience", nullable: true, type: "json" })
  workExperience: WorkExperience[];

  @Column({ name: "education", nullable: true, type: "json" })
  education: Education[];

  @Column({ name: "projects", nullable: true, type: "json" })
  projects: Project[];

  @Column({ name: "certifications", nullable: true, type: "json" })
  certifications: Certification[];

  @Column({ name: "languages", nullable: true, type: "json" })
  languages: Language[];

  @Column({ name: "volunteer_work", nullable: true, type: "json" })
  volunteerWork: VolunteerWork[];

  @Column({ nullable: true, type: "text" })
  website: string | null;

  @Column({ type: "text", default: () => "'{}'" })
  skills: string[];

  @Column({ name: "custom_resume_flag", default: true })
  customResumeFlag: boolean;

  @Column({ name: "summarized_resume", nullable: true })
  summarizedResume: string | null;

  @Column({
    type: "enum",
    enum: AvailableTemplates,
    default: AvailableTemplates.STACK,
  })
  preferredResume: TemplateName;
}
