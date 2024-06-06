import { faker } from "@faker-js/faker";
import {
  AvailableTemplates,
  Certification,
  Education,
  Language,
  Link,
  Project,
  VolunteerWork,
  WorkExperience,
} from "resume-lite";
import { User, UserApplicantConfig } from "../../entity";

export function createFakeUserApplicantConfig(user: User) {
  const userApplicantConfig = new UserApplicantConfig();
  userApplicantConfig.user = user;
  userApplicantConfig.firstName = faker.person.firstName();
  userApplicantConfig.lastName = faker.person.lastName();
  userApplicantConfig.email = faker.internet.email();
  userApplicantConfig.phone = faker.phone.number();
  userApplicantConfig.address = faker.location.streetAddress();
  userApplicantConfig.summary = faker.lorem.paragraph();
  userApplicantConfig.links = [
    { name: faker.lorem.word(), url: faker.internet.url() } as Link,
  ];
  userApplicantConfig.workExperience = [
    {
      company: faker.company.name(),
      position: faker.person.jobTitle(),
      startDate: faker.date.past().toISOString(),
      endDate: faker.date.recent().toISOString(),
      responsibilities: [faker.lorem.sentence(), faker.lorem.sentence()],
    } as WorkExperience,
  ];
  userApplicantConfig.education = [
    {
      institution: faker.company.name(),
      degree: faker.person.jobTitle(),
      startDate: faker.date.past().toISOString(),
      endDate: faker.date.recent().toISOString(),
    } as Education,
  ];
  userApplicantConfig.projects = [
    {
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      responsibilities: [faker.lorem.sentence(), faker.lorem.sentence()],
      website: faker.internet.url(),
      sourceCodeLink: faker.internet.url(),
    } as Project,
  ];
  userApplicantConfig.certifications = [
    {
      name: faker.lorem.word(),
      dateAquired: faker.date.past().toISOString(),
    } as Certification,
  ];
  userApplicantConfig.languages = [
    { name: faker.lorem.word(), proficiency: faker.lorem.word() } as Language,
  ];
  userApplicantConfig.volunteerWork = [
    {
      name: faker.company.name(),
      startDate: faker.date.past().toISOString(),
      endDate: faker.date.recent().toISOString(),
      description: faker.lorem.paragraph(),
    } as VolunteerWork,
  ];
  userApplicantConfig.website = faker.internet.url();
  userApplicantConfig.skills = [
    faker.lorem.word().repeat(faker.number.int({ min: 0, max: 30 })),
  ];
  userApplicantConfig.customResumeFlag = faker.datatype.boolean();
  userApplicantConfig.summarizedResume = faker.lorem.paragraph();
  userApplicantConfig.preferredResume = faker.helpers.arrayElement(
    Object.values(AvailableTemplates)
  );

  return userApplicantConfig;
}