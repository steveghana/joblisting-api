import AssociableModel from '../../../Config/associable';
import { Application } from '../../applications/entities/application.entity';
import { Client } from '../../clients/entities/client.entity';
import { Developer } from '../../developers/entities/developer.entity';
import { Interview } from '../../interviews/entities/interview.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Job } from './jobs.entity';
import uuid from '../../../util/uuid';
import { ClockHours } from '../../../apps/clocked-hours/entities/clocked-hour.entity';
import { ShortUrlEntity } from '../../../apps/Shorturl/model/shortUrl.entity';
// Role Entity
@Entity('roles')
export class Role extends AssociableModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid.makeUuid();

  @ManyToOne((type) => Client, (client) => client.roles)
  @JoinColumn({ name: 'client_id' })
  client: Client;
  @OneToMany(() => Job, (job) => job.role, {
    onDelete: 'CASCADE',
  })
  jobs: Job[];
  @OneToOne(() => ShortUrlEntity, (link) => link.role, { cascade: true })
  @JoinColumn({ name: 'link_id' })
  link: ShortUrlEntity;

  @OneToMany((type) => Developer, (developer) => developer.roles, {
    onDelete: 'CASCADE',
  })
  developers: Developer[];
  @OneToMany((type) => ClockHours, (hours) => hours.role, {
    onDelete: 'CASCADE',
  })
  clockedHours: ClockHours[];

  @Column()
  title: string;

  @Column()
  devsNeeded: string;
  @Column()
  methodology: string;
  @Column()
  aboutTheProject: string;
  @Column()
  experience: string;
  @Column()
  communicationPreferences: string;
  // Store skills as JSON

  @Column()
  vacancy_status: 'Open' | 'Closed'; // Open, Closed

  @OneToMany((type) => Interview, (interview) => interview.role, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  interviews: Interview[];

  @OneToMany((type) => Application, (application) => application.role, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  application: Application[];
}
