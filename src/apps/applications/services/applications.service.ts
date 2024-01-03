import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import Application from '../dataManager';
// import { m } from '@nestjs/platform-express';
import { useTransaction } from '../../../util/transaction';
import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import Roles from '../../../apps/roles/dataManager';
import { getAllApplicants } from '../DBQueries';
import { DevelopersService } from '../../../apps/developers/services/developers.service';
import User from '../../../apps/auth/dataManager/userEntity';
import { IStatusApplication } from '@/types/application';
import { getJobById } from '../../../apps/roles/DBQueries';

@Injectable()
export class ApplicationsService {
  constructor(private readonly developersService: DevelopersService) {}
  // private readonly storage = new Storage({
  //   keyFilename: 'path/to/keyfile.json', // Path to the downloaded JSON key file
  //   projectId: 'your-project-id', // Replace with the Google Cloud project ID
  // });
  // private readonly bucketName = 'savannahTech.io-api-asssets';
  create(
    createApplicationDto: CreateApplicationDto,
    dependencies: Dependencies = null,
  ) {
    const { roleId, jobId, years_of_experience, file, ...rest } =
      createApplicationDto;
    return useTransaction(async (transaction) => {
      const existinguser = await User.getByEmail(
        createApplicationDto.email,
        dependencies,
      );
      if (existinguser) {
        throw new HttpException(
          'A user with the same email has already applied to this role',
          HttpStatus.BAD_REQUEST,
        );
      }
      const existingApplicant = await Application.getByEmail(
        createApplicationDto.jobId,
        createApplicationDto.email,
      );
      if (existingApplicant) {
        throw new HttpException(
          'You have already applied to this role',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!(await Roles.getById(roleId))) {
        throw new HttpException(
          'Something went wrong, the role you were applying for could not be found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const existingJob = await getJobById(jobId);
      if (!existingJob) {
        throw new HttpException(
          'Something went wrong, the job you were applying for could not be found',
          HttpStatus.BAD_REQUEST,
        );
      }
      // const { link, fileId, fileType } = await this.uploadFile(file);// TODO: Enable google cloud storage api to use this feature
      const roles = await Roles.getById(roleId);
      return await Application.createApplication(
        roles,
        {
          ...rest,
          job: existingJob,
          years_of_experience,
          // resume: { link, fileId, fileType },
          resume: file,
          status: 'PendingShortlist',
        },
        transaction,
        dependencies,
      );
    });
  }

  private async uploadFile(file: Express.Multer.File) {
    // TODO: Enable google cloud storage api to use this feature
    //   const fileId = uuidv4();
    //   const fileName = `${fileId}-${file.originalname}`;
    //   const fileType = file.mimetype;
    //   // Check file type (PDF or Word)
    //   const isPDF = fileType.includes('pdf');
    //   const isWord = fileType.includes('word');
    //   if (!isPDF && !isWord) {
    //     throw new HttpException(
    //       'Invalid file type. Only PDF and Word files are allowed.',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    //   try {
    //     // Upload file to Google Cloud Storage
    //     await this.storage.bucket(this.bucketName).upload(file.path, {
    //       destination: fileName,
    //       gzip: true,
    //     });
    //     // Delete the temporary file
    //     await fs.promises.unlink(file.path);
    //     // Store the file link or metadata in your database
    //     const fileLink = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    //     // Implement your database logic to store the link or metadata
    //     // ...
    //     return { link: fileLink, fileId, fileType };
    //   } catch (error) {
    //     throw new HttpException(
    //       `Failed to upload file: ${error.message}`,
    //       HttpStatus.INTERNAL_SERVER_ERROR,
    //     );
    //   }
  }

  findAll(roleId: string, dependencies: Dependencies = null) {
    return useTransaction(async (transaction) => {
      if (!(await getAllApplicants(roleId, transaction, dependencies)).length) {
        return [];
      }
      const applicants = await getAllApplicants(
        roleId,
        transaction,
        dependencies,
      );
      return applicants.map((app) => {
        return {
          id: app.id,
          roleId: app.role.id,
          jobId: app.job.id,
          roleApplyingFor: app.roleApplyingFor,
          name: app.name,
          email: app.email,
          phoneNumber: app.phoneNumber,
          years_of_experience: app.years_of_experience,
          selectedSkills: app.selectedSkills,
          address: app.address,
          background_questions: app.background_questions,
          resume: app.resume,
          coverLetter: app.coverLetter,
          status: app.status,
        };
      });
    });
  }

  findOne(id: string) {
    return useTransaction(async () => {
      const data = await Application.getById(id);
      if (!data) {
        return null;
      }
      return data;
    });
  }

  update(
    id: string,
    status: IStatusApplication,
    dependencies: Dependencies = null,
  ) {
    dependencies = injectDependencies(dependencies, ['db', 'config', 'email']);
    return useTransaction(async (transaction) => {
      const applicant = await Application.getById(id);
      const {
        address,
        email,
        name,
        phoneNumber: phone_number,
        roleApplyingFor,
        selectedSkills,
        role: { id: roleId },
        years_of_experience,
      } = applicant;
      if (status === 'Shortlisted') {
        if (!roleId) {
          throw new HttpException(
            'The role for this applicant doesnt exist, i recommend you remove the applicant, or they should apply again later.',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (
          !(await this.developersService.create({
            address,
            email,
            devProfession: roleApplyingFor,
            salary: 0, //initial value of 0
            firstName: name.split(' ')[0],
            lastName: name.split(' ')[1] || '',
            phone_number,
            skills: selectedSkills,
            roleId,
            years_of_experience,
            role_status: 'Pending', // If the dev is short listed, they can then transition to pending
          }))
        ) {
          throw new HttpException(
            'Something went wrong, couldnt update developer info',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return await Application.destroy(id, transaction);
      }
      if (!(await Application.update(id, { status }, transaction))) {
        throw new HttpException(
          'Something went wrong, couldnt update role',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return await Application.update(id, { status }, transaction);
    });
  }

  remove(id: string) {
    return useTransaction(async (transaction) => {
      const deleted = await Application.destroy(id, transaction);
      if (!deleted) {
        throw new HttpException(
          'Something went wrong, couldnt delete applicant',
          HttpStatus.BAD_REQUEST,
        );
      }
    });
  }
  bulkremove(applicantIds: string[]) {
    return useTransaction(async (transaction) => {
      return await Promise.all(
        applicantIds.map(async (id) => {
          const deleted = await Application.destroy(id, transaction);
          if (!deleted) {
            throw new HttpException(
              'Something went wrong, couldnt delete applicants',
              HttpStatus.BAD_REQUEST,
            );
          }
          return deleted[0];
        }),
      );
    });
  }
}
