// Import necessary modules from TypeORM
import { Developer } from '../../developers/entities/developer.entity';
import { Role } from '../../roles/entities/role.entity';
import { IStatusApplication } from '../../../types/application';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import AssociableModel from '../../../Config/associable';
import uuid from '../../../util/uuid';
import { Job } from '../../../apps/roles/entities/jobs.entity';

// Developer Entity

// Application Entity
@Entity('applications')
export class Application extends AssociableModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid.makeUuid();
  @ManyToOne((type) => Role, (role) => role.application)
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @ManyToOne((type) => Job, (job) => job.applicant)
  @JoinColumn({ name: 'job_id' })
  job: Job;
  @Column()
  roleApplyingFor: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  phoneNumber: string;
  @Column()
  years_of_experience: string;
  @Column('simple-json')
  selectedSkills: string[];
  @Column()
  address: string;

  @Column({ type: 'simple-json', nullable: true })
  background_questions?: Record<string, string>; // Store background questions as JSON
  @Column({ type: 'simple-json', nullable: true })
  resume: Record<string, string>;
  @Column()
  coverLetter: string;
  @Column()
  status: IStatusApplication; // Submitted, Shortlisted, Rejected IStatusApplication
}
