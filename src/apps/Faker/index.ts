import { findElseCreateClient } from '../clients/DBQueries';
import { createRoles, createJobs } from '../roles/DBQueries'; // import your Role service
import { useTransaction } from '../../Config/transaction';
import { generateClientData } from './client.Fake';
import { generateRoleData } from './roles.fake'; // import your Role data generation function
import { generateJobData } from './job.Fake'; // import your Job data generation function
import { generateApplicantData } from './applicants.fake';
import { createApplication } from '../applications/DBQueries';
import { createRoleLink } from '../Shorturl/service/util';

export async function generateAndPersistData() {
  return useTransaction(async (transaction) => {
    // generate client data
    const clients = Array.from({ length: 11 }, generateClientData);
    const savedClients = [];
    for (const client of clients) {
      const [savedClient, created] = await findElseCreateClient(
        client.email,
        client,
        transaction,
      );
      savedClients.push(savedClient);
    }

    // generate role data for each client
    const savedRoles = [];
    for (const client of savedClients) {
      const roles = Array.from({ length: 3 }, () => generateRoleData(client));
      for (const role of roles) {
        const roles = await createRoles(role, transaction);
        await createRoleLink(client.id, roles, transaction);
        savedRoles.push(roles);
      }
    }
    const savedJobs = [];
    // generate job data for each role
    const roleJobMap = new Map();

    // generate job data for each role
    for (const role of savedRoles) {
      const job = generateJobData();
      const createdJob = await createJobs(role.id, job, transaction);
      roleJobMap.set(role.id, createdJob.job);
      savedJobs.push(createdJob);
    }
    // console.log(roleJobMap, 'jobs map .......................');
    // generate job data for each role
    for (const role of savedRoles) {
      const jobs = roleJobMap.get(role.id);
      console.log(jobs, 'jobs map .......................');
      if (jobs) {
        const applications = Array.from(
          { length: 2 },
          () => generateApplicantData(jobs), // Use the first job associated with the role
        );
        for (const application of applications) {
          await createApplication(role, application, transaction);
        }
      }
    }
  });
}
