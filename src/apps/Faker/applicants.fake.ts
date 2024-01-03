import { IStatusApplication } from '../../types/application';
import * as faker from 'faker';
import { JobInfo } from '../roles/dto/create-role.dto';

export function generateApplicantData(job: JobInfo) {
  return {
    name: faker.name.findName(),
    roleApplyingFor: faker.commerce.productName(),
    job,
    address: faker.address.streetAddress(),
    coverLetter: faker.lorem.paragraph(),
    phoneNumber: faker.phone.phoneNumber(),
    resume: {}, // You can populate this with appropriate data
    selectedSkills: [faker.random.word(), faker.random.word()],
    years_of_experience: faker.datatype.number({ min: 1, max: 10 }).toString(),
    email: faker.internet.email(),
    status: 'PendingShortlist' as IStatusApplication,
    avatar: faker.internet.avatar(),
  };
}

// Generate an array of applicant data
// const applicants = Array.from({ length: 1000 }, generateApplicantData);
