// Import necessary modules from TypeORM
import { UserEntity as User } from '../../auth/models/user.entity';
import AssociableModel from '../../../Config/associable';
import { ClockHours } from '../../clocked-hours/entities/clocked-hour.entity';
import { Interview } from '../../interviews/entities/interview.entity';
import { Role } from '../../roles/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
  ManyToMany,
} from 'typeorm';
import uuid from '../../../util/uuid';
import { Client } from '../../../apps/clients/entities/client.entity';
import { Job } from '../../../apps/roles/entities/jobs.entity';
import { IRoleStatus } from '../../../types/developer';
@Entity('developer')
export class Developer extends AssociableModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid.makeUuid();
  @ManyToOne((type) => User, (user) => user.developer)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne((type) => Client, (client) => client.roles)
  @JoinColumn({ name: 'client_id' })
  client: Client;
  @OneToOne((type) => Job, (developer) => developer.developer, {
    cascade: true,
  })
  job: Job;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column('simple-json')
  skills: string[];
  @Column()
  phone_number: string;
  @Column()
  salary: number;
  @Column()
  years_of_experience: string;

  @Column()
  address: string;
  // @Column()
  // devProfession: string;
  @Column()
  workStatus: 'Active' | 'Not Active';
  @Column({ default: 'External' })
  role_status: IRoleStatus;
  @ManyToOne((type) => Role, (role) => role.developers)
  @JoinColumn({ name: 'role_id' })
  roles: Role;
  @ManyToOne(() => Interview, (interview) => interview.candidate, {
    eager: true,
  })
  candidateInterview: Interview;

  @ManyToMany(() => Interview, (interview) => interview.guests)
  guestInterviews: Interview[];
  @OneToMany((type) => ClockHours, (clockHours) => clockHours.developer)
  clockHours: ClockHours[];
  @Column({ default: new Date() })
  startRoleDate!: Date;
  // @OneToMany((type) => Application, (application) => application.developer)
  // applications: Application[];
}
