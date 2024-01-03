// Import necessary modules from TypeORM
import AssociableModel from '../../../Config/associable';
import { Developer } from '../../developers/entities/developer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import uuid from '../../../util/uuid';
import { Role } from '../../../apps/roles/entities/role.entity';
// ClockHours Entity
@Entity('clock_hours')
export class ClockHours extends AssociableModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid.makeUuid();

  @ManyToOne((type) => Developer, (developer) => developer.clockHours)
  @JoinColumn({ name: 'developer_id' })
  developer: Developer;
  @ManyToOne((type) => Role, (role) => role.clockedHours)
  @JoinColumn({ name: 'role_id' })
  role: Role;
  @Column()
  date: Date;

  @Column()
  hours_worked: number;
}
