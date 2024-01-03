import { IClient } from '../../types/client';
import { datatype, name, commerce, random, date } from 'faker';

export function generateRoleData(client: IClient) {
  return {
    id: datatype.uuid(),
    title: commerce.productName(),
    client,
    devsNeeded: datatype.number({ min: 1, max: 10 }).toString(),
    methodology: commerce.productMaterial(),
    aboutTheProject: commerce.productDescription(),
    experience: random.arrayElement(['Junior', 'Mid', 'Senior']),
    communicationPreferences: random.arrayElement(['email', 'Video calls']),
    vacancy_status: 'Open' as 'Open' | 'Closed',
    // client, jobs, link, developers, clockedHours, interviews, and application are not included as per your request
  };
}

// Generate an array of role data
const roles = Array.from({ length: 1000 }, generateRoleData);
