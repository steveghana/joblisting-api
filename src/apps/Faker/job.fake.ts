import { datatype, name, commerce, random, date, address } from 'faker';

export function generateJobData() {
  return {
    id: datatype.uuid(),
    description: commerce.productDescription(),
    joblink: `https://${commerce.product()}.com`,
    roleType: 'Remote',
    whenToStart: date.future(),
    employmentType: random.arrayElement(['Full-time', 'Part-time', 'Contract']),
    country: address.country(),
    selectedSkills: [commerce.department(), commerce.department()],
    roleName: name.jobTitle(),
    jobType: name.jobType(),
    salary: `${datatype.number({ min: 30000, max: 100000 })}`,
    tasks: [commerce.productName(), commerce.productName()],
    roleCategory: commerce.department(),
    postedDate: date.past(),
    // role, applicant, and developer are not included as per your request
  };
}

// Generate an array of job data
// const jobs = Array.from({ length: 1000 }, generateJobData);
