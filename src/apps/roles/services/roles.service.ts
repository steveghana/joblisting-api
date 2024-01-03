import { CreateRoleDto, JobInfo, RoleInfoDto } from '../dto/create-role.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import Roles from '../dataManager';
import Client from '../../clients/dataManager';
import { useTransaction } from '../../../util/transaction';
import { Dependencies } from '../../../util/dependencyInjector';
import { deleteJob, getAllRoles } from '../DBQueries';
import { IRole } from '../../../types/role';
import { createRoleLink } from '../../../apps/Shorturl/service/util';

@Injectable()
export class RolesService {
  /**
   * Creates a new role
   * @param {string} clientId - The id of the client
   * @param {CreateRoleDto['Project Details']} createRoleDto - The details of the role to be created
   * @param {Dependencies} dependencies - The dependencies to be injected
   * @returns {Promise<RoleInfoDto>} The created role
   */
  public async create(
    clientId: string,
    createRoleDto: CreateRoleDto['Project Details'],
    dependencies: Dependencies = null,
  ) {
    const roleData = await useTransaction(async (transaction) => {
      const clientDetails = await Client.getById(clientId);
      const { data } = await Roles.createRoles(
        {
          client: clientDetails.data,
          ...createRoleDto,
          vacancy_status: 'Open',
        },
        transaction,
        dependencies,
      );
      const link = await createRoleLink(
        clientId,
        data,
        transaction,
        dependencies,
      );
      return { data };
    });

    // Roles.update(roleData.id, {})
    return { ...roleData };
  }
  /**
   * Creates a new job posting for a role
   * @param {string} roleId - The id of the role
   * @param {Omit<JobInfo, 'vacancy_status'>} createRoleDto - The details of the job to be created
   * @param {Dependencies} dependencies - The dependencies to be injected
   * @returns {Promise<JobInfo>} The created job posting
   */
  public async createJob(
    roleId: string,
    createRoleDto: Omit<JobInfo, 'vacancy_status'>,
    dependencies: Dependencies = null,
  ) {
    return useTransaction(async (transaction) => {
      const roleDetails = await Roles.getById(roleId);

      const data = await Roles.createJobs(
        roleDetails.id,
        {
          ...createRoleDto,
          country:
            roleDetails.client.country?.label ||
            roleDetails.client?.country?.name,
        },
        transaction,
        dependencies,
      );

      // if (!updatejobs || !link) {
      //   throw new HttpException(
      //     'Couldnt create a link for this project',
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }
      return data;
    });
  }

  getAllApplicants(dependencies: Dependencies = null) {
    return useTransaction(async (transaction) => {
      const data = await getAllRoles(transaction, dependencies);
      if (!data.length) {
        return null;
      }
      return data;
    });
  }
  findAll(dependencies: Dependencies = null) {
    return useTransaction(async (transaction) => {
      const data = await getAllRoles(transaction, dependencies);
      if (!data.length) {
        return null;
      }
      return data;
    });
  }

  getApplicant(id: string) {
    return useTransaction(async (transaction) => {
      const data = await Roles.getById(id);
      if (!data) {
        return null;
      }
      return data;
    });
  }
  findOne(id: string) {
    return useTransaction(async (transaction) => {
      const data = await Roles.getById(id);
      if (!data) {
        return null;
      }
      return data;
    });
  }

  /**
   * Updates an existing role
   * @param {string} id - The id of the role to be updated
   * @param {Partial<IRole>} updateClientDto - The details of the role to be updated
   * @param {Dependencies} dependencies - The dependencies to be injected
   * @returns {Promise<IRole>} The updated role
   */
  update(
    id: string,
    updateClientDto: Partial<IRole>,
    dependencies: Dependencies = null,
  ): Promise<IRole> {
    return useTransaction(async (transaction) => {
      // const { , ...rest } = updateClientDto;
      const data = await Roles.update(
        id,
        {
          // selectedSkills: updateClientDto['Role Info']?.selectedSkills,
          ...updateClientDto,
        },
        transaction,
      );
      if (!data) {
        throw new HttpException(
          'Something went wrong, couldnt update role',
          HttpStatus.BAD_REQUEST,
        );
      }
      return data;
    });
  }

  remove(id: string, dependencies: Dependencies = null) {
    return useTransaction(async (transaction) => {
      const deleted = await Roles.destroy(id, transaction);
      if (!deleted) {
        throw new HttpException(
          'Something went wrong, couldnt delete role',
          HttpStatus.BAD_REQUEST,
        );
      }
      return deleted;
    });
  }
  deleteJob(id: string, dependencies: Dependencies = null) {
    return useTransaction(async (transaction) => {
      const deleted = await deleteJob(id, transaction);
      if (!deleted) {
        throw new HttpException(
          'Something went wrong, couldnt delete role',
          HttpStatus.BAD_REQUEST,
        );
      }
      return deleted;
    });
  }
}
