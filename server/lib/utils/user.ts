import { User, UserApplicantConfig } from "../../src/entity";

import { ResumeData } from "resume-lite";

export function buildUserResumeData(
  user: User,
  userApplicantConfig: UserApplicantConfig
): ResumeData {
  return {
    personalInfo: {
      name: userApplicantConfig.firstName + " " + userApplicantConfig.lastName,
      email: userApplicantConfig.email,
      phone: userApplicantConfig.phone,
      address: userApplicantConfig.address,
      summary: userApplicantConfig.summary,
      links: userApplicantConfig.links,
    },
    workExperience: userApplicantConfig.workExperience,
    education: userApplicantConfig.education,
    skills: userApplicantConfig.skills,
    projects: userApplicantConfig.projects,
    certifications: userApplicantConfig.certifications,
    languages: userApplicantConfig.languages,
    volunteerWork: userApplicantConfig.volunteerWork,
  };
}
