// Client Entity
import AssociableModel from '../../../Config/associable';
import { Role } from '../../roles/entities/role.entity';
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
import { Developer } from '../../../apps/developers/entities/developer.entity';
@Entity('clients')
export class Client extends AssociableModel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid.makeUuid();

  @Column()
  name: string;
  @Column()
  companyLogo: string;
  @Column()
  aboutTheCompany: string;
  @Column('simple-json')
  country: Record<string, any>;

  @Column('simple-array')
  industry: [string];

  @Column({ nullable: true })
  avatar?: string;
  @Column()
  communicationPreferences: string;
  @Column()
  phoneNumber: string;
  @Column()
  companyName: string;

  @Column()
  email: string;
  @Column()
  numOfEmployees: string;

  @Column()
  projectTitle: string;
  @Column({ nullable: true })
  startDate: Date;
  @OneToMany((type) => Role, (role) => role.client, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  roles: Role[];
  @OneToMany((type) => Developer, (developer) => developer.client, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  developers: Developer[];
}
