import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity'; // Import the Role entity
import AssociableModel from '../../../Config/associable';
import uuid from '../../../util/uuid';
import { Developer } from '../../../apps/developers/entities/developer.entity';
import { Application } from '../../../apps/applications/entities/application.entity';

@Entity('jobs')
export class Job extends AssociableModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid.makeUuid();

  @ManyToOne(() => Role, (role) => role.jobs)
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @ManyToOne(() => Application, (applicantion) => applicantion.job)
  @JoinColumn({ name: 'job_id' })
  applicant: Application;
  @ManyToOne((type) => Developer, (dev) => dev.job)
  @JoinColumn({ name: 'developer_id' })
  developer: Developer[];
  @Column()
  description: string;
  @Column({ nullable: true })
  joblink: string;
  @Column({ default: 'Remote' })
  roleType: string;
  @Column({ default: new Date() })
  whenToStart: Date;
  @Column()
  employmentType: string;
  @Column()
  country: string;

  @Column('simple-json')
  selectedSkills: string[];
  //   @Column()
  //   joblocation: string;
  @Column()
  roleName: string;

  @Column()
  jobType: string;

  @Column()
  salary: string;

  @Column('simple-json')
  tasks: string[];

  @Column()
  roleCategory: string;

  @Column()
  postedDate: Date;
}
