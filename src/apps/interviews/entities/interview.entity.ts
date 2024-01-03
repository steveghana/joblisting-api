// Import necessary modules from TypeORM
import AssociableModel from '../../../Config/associable';
import { Developer } from '../../developers/entities/developer.entity';
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
  JoinTable,
} from 'typeorm';
// Interview Entity
import uuid from '../../../util/uuid';
import { Comment } from './comments.entity';
@Entity('interviews')
export class Interview extends AssociableModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid.makeUuid();

  @ManyToOne((type) => Role, (role) => role.interviews)
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @ManyToOne(() => Developer, (developer) => developer.candidateInterview)
  candidate: Developer;
  @OneToMany(() => Comment, (comment) => comment.interview)
  comments: Comment[];
  @ManyToMany(() => Developer, (developer) => developer.guestInterviews)
  @JoinTable()
  guests: Developer[];
  @Column()
  eventType: string;
  @Column()
  eventOption: string;
  @Column()
  description: string;
  @Column()
  eventLInk: string;
  @Column()
  starttime: string;
  @Column()
  endtime: string;
  @Column()
  startDate: Date;
  @Column()
  endDate: Date;
  @Column()
  status: 'Scheduled' | 'Completed' | 'Canceled'; // Scheduled, Completed, Canceled
}
