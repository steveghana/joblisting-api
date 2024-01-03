import { Role } from '../../../apps/roles/entities/role.entity';
import { Entity, Column, PrimaryColumn, BaseEntity, OneToOne } from 'typeorm';
// import AssociableModel from '../../apps/Config/associable';

@Entity({ name: 'shorturl' })
export class ShortUrlEntity {
  @Column({ unique: true, primary: true })
  shortComponent!: string;

  @Column()
  longComponent!: string;

  @OneToOne(() => Role, (role) => role.link)
  role: Role;
}
