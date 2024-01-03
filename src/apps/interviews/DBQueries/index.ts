import {
  Dependencies,
  injectDependencies,
} from '../../../util/dependencyInjector';
import uuidUtil from '../../../util/uuid';
import { DeepPartial, EntityManager, In, QueryRunner } from 'typeorm';
import myDataSource from '../../../../db/data-source';
import uuid from '../../../util/uuid';
import { Iinterviews, TInterviewComment } from '@/types/interviews';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Interview } from '../entities/interview.entity';

// Import your actual interviews module
export async function scheduleInterview(
  interviewData: Partial<
    Omit<Iinterviews, 'guest' | 'interviewee' | 'role'> & {
      candidateId: string;
      guests: string[];
    }
  >,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  const interviewRepo = transaction.getRepository(
    dependencies.db.models.interviews,
  );
  const { guests: guestIds, candidateId, ...rest } = interviewData;
  const devRepo = transaction.getRepository(dependencies.db.models.developer);
  const candidate = await devRepo.findOne({
    where: { id: candidateId },
    relations: ['candidateInterview', 'roles'],
  });

  if (candidate.candidateInterview) {
    throw new HttpException(
      'Candidate already has an interview scheduled.',
      HttpStatus.BAD_REQUEST,
    );
  }

  const guests = await devRepo.find({ where: { id: In([...guestIds]) } });

  if (!guests) {
    throw new HttpException(
      'Could not schedule interview. Check if all Developers exist.',
      HttpStatus.BAD_REQUEST,
    );
  }
  const newInterview = interviewRepo.create({
    candidate,
    guests: [...guests],

    ...rest,
    role: candidate.roles, // We couldn't grap the role from the clientside we can use the candidate role for this interaction
  });
  const data = await interviewRepo.save(newInterview);

  return data;
}

export async function addComments(
  interviewData: TInterviewComment,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);

  const { interviewId, message, name } = interviewData;
  const interviewRepo = myDataSource.getRepository(
    dependencies.db.models.interviews,
  );
  const commentRepo = myDataSource.getRepository(
    dependencies.db.models.comments,
  );
  const existingInterview = await interviewRepo.findOne({
    where: {
      id: interviewId,
    },
  });

  const newComment = commentRepo.create({
    interview: existingInterview,
    message,
    name,
  });

  const saved = await commentRepo.save(newComment);

  return saved;
}

export async function updateInterview(
  id: string,
  interviewData: Partial<
    Omit<Iinterviews, 'guest' | 'interviewee' | 'role'> & {
      candidateId: string;
      guests: string[];
    }
  >,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) {
  dependencies = injectDependencies(dependencies, ['db']);
  const interviewRepo = transaction.getRepository(
    dependencies.db.models.interviews,
  );
  const { guests: guestIds, candidateId, ...rest } = interviewData;
  const devRepo = transaction.getRepository(dependencies.db.models.developer);

  const candidate = await devRepo.findOne({
    where: { id: candidateId },
  });
  const guests = await devRepo.find({
    where: { id: In(guestIds) },
  });

  if (!candidate || guests.length !== interviewData.guests.length) {
    throw new HttpException(
      'Could not update interview. Check if Candidate or Developer(s) exist.',
      HttpStatus.BAD_REQUEST,
    );
  }

  // Load the existing interview
  const existingInterview = await interviewRepo.findOne({
    where: { id },
    relations: ['guests', 'candidate', 'comments'],
  });

  if (!existingInterview) {
    throw new HttpException(
      'No scheduled interview found',
      HttpStatus.NOT_FOUND,
    );
  }

  // Update the properties manually
  existingInterview.guests = guests;
  existingInterview.candidate = candidate;
  for (const prop in rest) {
    existingInterview[prop] = rest[prop];
  }

  // Save the updated interview
  const updatedInterview = await interviewRepo.save(existingInterview);

  return updatedInterview;
}

export function getInterviewById(
  id: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return

  return myDataSource.manager
    .getRepository(dependencies.db.models.interviews)
    .findOne({
      where: { id },
      relations: ['guests', 'candidate', 'comments'],
    });
}

export async function getAllInterviews(
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const interviewData = await myDataSource.manager
    .getRepository(dependencies.db.models.interviews)
    .createQueryBuilder('interviews')
    .leftJoinAndSelect('interviews.guests', 'guests')
    .leftJoinAndSelect('interviews.comments', 'comments')
    .leftJoinAndSelect('guests.user', 'guestuser')
    .addSelect(['guestuser.email']) // Select only the 'email' column from the 'user' table for guests
    .leftJoinAndSelect('interviews.candidate', 'candidate')
    .leftJoinAndSelect('candidate.user', 'candidateuser')
    .addSelect(['candidateuser.email']) // Select only the 'email' column from the 'user' table for the candidate
    .getMany();

  return interviewData;
}
export async function cancelInterview(
  interviewId: string,
  transaction: EntityManager = null,
  dependencies: Dependencies = null,
) /* : Promise<ICredentialToken> */ {
  dependencies = injectDependencies(dependencies, ['db']);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const interviewRepo = transaction.getRepository(
    dependencies.db.models.interviews,
  );
  const commentRepo = transaction.getRepository(
    dependencies.db.models.comments,
  );
  const commentDeleted = await commentRepo.delete({
    interview: { id: interviewId },
  });
  const { affected } = await interviewRepo.delete({ id: interviewId });
  return affected;
}

export default {
  scheduleInterview,
  getAllInterviews,
  getInterviewById,
};
