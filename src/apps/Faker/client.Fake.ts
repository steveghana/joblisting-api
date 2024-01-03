import * as faker from 'faker';

export function generateClientData() {
  return {
    // id: faker.datatype.uuid(),
    name: faker.name.findName(),
    companyLogo: faker.image.business(),
    aboutTheCompany: faker.company.catchPhrase(),
    country: { name: faker.address.country() },
    industry: [faker.company.bsNoun()],
    avatar: faker.image.avatar(),
    communicationPreferences: faker.random.arrayElement([
      'email',
      'Video calls',
    ]),
    phoneNumber: faker.phone.phoneNumber(),
    companyName: faker.company.companyName(),
    email: faker.internet.email(),
    numOfEmployees: faker.datatype.number({ min: 1, max: 1000 }).toString(),
    projectTitle: faker.commerce.productName(),
    startDate: faker.date.past(),
    // roles and developers are not included as per your request
  };
}

// Generate an array of client data
// const clients = Array.from({ length: 1000 }, generateClientData);
