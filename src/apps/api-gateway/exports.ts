/* === Modules === */
import { ApplicationsModule } from '../applications/applications.module';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule } from '../clients/clients.module';
import { ClockedHoursModule } from '../clocked-hours/clocked-hours.module';
import { ContactModule } from '../Contact/contact.module';
import { DevelopersModule } from '../developers/tests/developers.module';
import { InterviewsModule } from '../interviews/interviews.module';
import { RolesModule } from '../roles/roles.module';
import { ShortModule } from '../Shorturl/short.module';
// import s from '../../apps/clients/controllers/clients.controller.spec'
/* ==== All Entities are located in Config/model.js */
export const Modules = [
  AuthModule,
  ClientsModule,
  ClockedHoursModule,
  DevelopersModule,
  InterviewsModule,
  ApplicationsModule,
  RolesModule,
  ShortModule,
  ContactModule,
];
