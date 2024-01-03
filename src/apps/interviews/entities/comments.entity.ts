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
import { Interview } from './interview.entity';
@Entity('interviewComments')
export class Comment extends AssociableModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid.makeUuid();
  @ManyToOne(() => Interview, (interview) => interview.comments)
  @JoinColumn({ name: 'interview_id' })
  interview: Interview;
  @Column()
  name: string;
  @Column()
  message: string;
}
