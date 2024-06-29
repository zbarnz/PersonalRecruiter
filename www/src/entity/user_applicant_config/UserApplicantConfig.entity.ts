import {
  Certification,
  Education,
  Language,
  Link,
  Project,
  TemplateName,
  VolunteerWork,
  WorkExperience,
} from "resume-lite";

import { User } from "../user/User.entity";

export class UserApplicantConfig {
  id: number;
  user: User | number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  links: Link[];
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  volunteerWork: VolunteerWork[];
  website: string | null;
  skills: string[];
  customResumeFlag: boolean;
  customClFlag: boolean;
  summarizedResume: string | null;
  preferredResume: TemplateName;

  constructor() {}
}
