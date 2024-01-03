import { MigrationInterface, QueryRunner } from "typeorm";

export class SavannatechDb1704185681196 implements MigrationInterface {
    name = 'SavannatechDb1704185681196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "credentialToken" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "uuid" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "userEmail" character varying, CONSTRAINT "UQ_2a084410d847ef16323a2f500fe" UNIQUE ("uuid"), CONSTRAINT "PK_3df76481d610656845be1b220b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jobs" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "joblink" character varying, "roleType" character varying NOT NULL DEFAULT 'Remote', "whenToStart" TIMESTAMP NOT NULL DEFAULT '"2024-01-02T08:54:44.773Z"', "employmentType" character varying NOT NULL, "country" character varying NOT NULL, "selectedSkills" text NOT NULL, "roleName" character varying NOT NULL, "jobType" character varying NOT NULL, "salary" character varying NOT NULL, "tasks" text NOT NULL, "roleCategory" character varying NOT NULL, "postedDate" TIMESTAMP NOT NULL, "role_id" uuid, "job_id" uuid, "developer_id" uuid, CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "applications" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleApplyingFor" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "years_of_experience" character varying NOT NULL, "selectedSkills" text NOT NULL, "address" character varying NOT NULL, "background_questions" text, "resume" text, "coverLetter" character varying NOT NULL, "status" character varying NOT NULL, "role_id" uuid, "job_id" uuid, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "companyLogo" character varying NOT NULL, "aboutTheCompany" character varying NOT NULL, "country" text NOT NULL, "industry" text NOT NULL, "avatar" character varying, "communicationPreferences" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "companyName" character varying NOT NULL, "email" character varying NOT NULL, "numOfEmployees" character varying NOT NULL, "projectTitle" character varying NOT NULL, "startDate" TIMESTAMP, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interviewComments" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "message" character varying NOT NULL, "interview_id" uuid, CONSTRAINT "PK_a6a47704301f524296acedc1902" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interviews" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventType" character varying NOT NULL, "eventOption" character varying NOT NULL, "description" character varying NOT NULL, "eventLInk" character varying NOT NULL, "starttime" character varying NOT NULL, "endtime" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "role_id" uuid, "candidateId" uuid, CONSTRAINT "PK_fd41af1f96d698fa33c2f070f47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shorturl" ("shortComponent" character varying NOT NULL, "longComponent" character varying NOT NULL, CONSTRAINT "UQ_d4fb996cb4d353480a6ce3c310e" UNIQUE ("shortComponent"), CONSTRAINT "PK_d4fb996cb4d353480a6ce3c310e" PRIMARY KEY ("shortComponent"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "devsNeeded" character varying NOT NULL, "methodology" character varying NOT NULL, "aboutTheProject" character varying NOT NULL, "experience" character varying NOT NULL, "communicationPreferences" character varying NOT NULL, "vacancy_status" character varying NOT NULL, "client_id" uuid, "link_id" character varying, CONSTRAINT "REL_979652cacdc371c447ee851c5d" UNIQUE ("link_id"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clock_hours" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "hours_worked" integer NOT NULL, "developer_id" uuid, "role_id" uuid, CONSTRAINT "PK_c2cca5b5bca39b4ddba79d80195" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "developer" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "skills" text NOT NULL, "phone_number" character varying NOT NULL, "salary" integer NOT NULL, "years_of_experience" character varying NOT NULL, "address" character varying NOT NULL, "workStatus" character varying NOT NULL, "role_status" character varying NOT NULL DEFAULT 'External', "startRoleDate" TIMESTAMP NOT NULL DEFAULT '"2024-01-02T08:54:44.827Z"', "user_id" uuid, "client_id" uuid, "role_id" uuid, "candidateInterviewId" uuid, CONSTRAINT "PK_71b846918f80786eed6bfb68b77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "bio" character varying, "website" character varying, "location" character varying, "github" character varying, "linkedin" character varying, "role" character varying NOT NULL, "emailAddresses" text, "isActive" boolean NOT NULL DEFAULT false, "googleVerified" boolean NOT NULL DEFAULT false, "linkedinVerified" boolean NOT NULL DEFAULT false, "githubVerified" boolean NOT NULL DEFAULT false, "isSuperAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "authToken" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "lastUsed" TIMESTAMP NOT NULL DEFAULT '"2024-01-02T08:54:44.828Z"', "credentialTokenId" integer, "userEmail" character varying, CONSTRAINT "PK_eb8fa60b49ec49031fa0cab6d3e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interviews_guests_developer" ("interviewsId" uuid NOT NULL, "developerId" uuid NOT NULL, CONSTRAINT "PK_bc1f39ae279bb89343e36b2ec18" PRIMARY KEY ("interviewsId", "developerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4ecb9eab4fdb4fd16f28535af4" ON "interviews_guests_developer" ("interviewsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_897bfe89fd15496d65cefdb84c" ON "interviews_guests_developer" ("developerId") `);
        await queryRunner.query(`ALTER TABLE "credentialToken" ADD CONSTRAINT "FK_fa3b591a5406eb5ee83158a83c7" FOREIGN KEY ("userEmail") REFERENCES "user"("email") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_52eb1e9bce5a39e82266a9b42aa" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_75f2e130e4b1372fea0b6248a17" FOREIGN KEY ("job_id") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_154dcb5ce1bed0b171602e9111c" FOREIGN KEY ("developer_id") REFERENCES "developer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_0765275891b64a32533bf3e30e3" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_8aba14d7f098c23ba06d8693235" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interviewComments" ADD CONSTRAINT "FK_30e6f5993a925ec84477a3f18d3" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interviews" ADD CONSTRAINT "FK_70cde0df6012d32717e12f34a49" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interviews" ADD CONSTRAINT "FK_9b47fb5a4e06ccb14d20d2f06fd" FOREIGN KEY ("candidateId") REFERENCES "developer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_d0b5383e5f33fe2457f497e24c3" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_979652cacdc371c447ee851c5d6" FOREIGN KEY ("link_id") REFERENCES "shorturl"("shortComponent") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clock_hours" ADD CONSTRAINT "FK_3bc429eee03f0c0fd5a6f4cbe8d" FOREIGN KEY ("developer_id") REFERENCES "developer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clock_hours" ADD CONSTRAINT "FK_e453883455c18eb71201fbf8fe3" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "developer" ADD CONSTRAINT "FK_db2ae4e35aaa411774bd4752fed" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "developer" ADD CONSTRAINT "FK_4a6d7f90d5287b0a7ca15baa0d7" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "developer" ADD CONSTRAINT "FK_e66b91765591e5686aa68228b74" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "developer" ADD CONSTRAINT "FK_d1cf5710bcb968ac3d5177e5985" FOREIGN KEY ("candidateInterviewId") REFERENCES "interviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "authToken" ADD CONSTRAINT "FK_d1adaf94c83cb8593f6d744c1ba" FOREIGN KEY ("userEmail") REFERENCES "user"("email") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "authToken" ADD CONSTRAINT "FK_af81ec9611dce9d566ee9f5ec3a" FOREIGN KEY ("credentialTokenId") REFERENCES "credentialToken"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "interviews_guests_developer" ADD CONSTRAINT "FK_4ecb9eab4fdb4fd16f28535af47" FOREIGN KEY ("interviewsId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "interviews_guests_developer" ADD CONSTRAINT "FK_897bfe89fd15496d65cefdb84c4" FOREIGN KEY ("developerId") REFERENCES "developer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "interviews_guests_developer" DROP CONSTRAINT "FK_897bfe89fd15496d65cefdb84c4"`);
        await queryRunner.query(`ALTER TABLE "interviews_guests_developer" DROP CONSTRAINT "FK_4ecb9eab4fdb4fd16f28535af47"`);
        await queryRunner.query(`ALTER TABLE "authToken" DROP CONSTRAINT "FK_af81ec9611dce9d566ee9f5ec3a"`);
        await queryRunner.query(`ALTER TABLE "authToken" DROP CONSTRAINT "FK_d1adaf94c83cb8593f6d744c1ba"`);
        await queryRunner.query(`ALTER TABLE "developer" DROP CONSTRAINT "FK_d1cf5710bcb968ac3d5177e5985"`);
        await queryRunner.query(`ALTER TABLE "developer" DROP CONSTRAINT "FK_e66b91765591e5686aa68228b74"`);
        await queryRunner.query(`ALTER TABLE "developer" DROP CONSTRAINT "FK_4a6d7f90d5287b0a7ca15baa0d7"`);
        await queryRunner.query(`ALTER TABLE "developer" DROP CONSTRAINT "FK_db2ae4e35aaa411774bd4752fed"`);
        await queryRunner.query(`ALTER TABLE "clock_hours" DROP CONSTRAINT "FK_e453883455c18eb71201fbf8fe3"`);
        await queryRunner.query(`ALTER TABLE "clock_hours" DROP CONSTRAINT "FK_3bc429eee03f0c0fd5a6f4cbe8d"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_979652cacdc371c447ee851c5d6"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_d0b5383e5f33fe2457f497e24c3"`);
        await queryRunner.query(`ALTER TABLE "interviews" DROP CONSTRAINT "FK_9b47fb5a4e06ccb14d20d2f06fd"`);
        await queryRunner.query(`ALTER TABLE "interviews" DROP CONSTRAINT "FK_70cde0df6012d32717e12f34a49"`);
        await queryRunner.query(`ALTER TABLE "interviewComments" DROP CONSTRAINT "FK_30e6f5993a925ec84477a3f18d3"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_8aba14d7f098c23ba06d8693235"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_0765275891b64a32533bf3e30e3"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_154dcb5ce1bed0b171602e9111c"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_75f2e130e4b1372fea0b6248a17"`);
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_52eb1e9bce5a39e82266a9b42aa"`);
        await queryRunner.query(`ALTER TABLE "credentialToken" DROP CONSTRAINT "FK_fa3b591a5406eb5ee83158a83c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_897bfe89fd15496d65cefdb84c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4ecb9eab4fdb4fd16f28535af4"`);
        await queryRunner.query(`DROP TABLE "interviews_guests_developer"`);
        await queryRunner.query(`DROP TABLE "authToken"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "developer"`);
        await queryRunner.query(`DROP TABLE "clock_hours"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "shorturl"`);
        await queryRunner.query(`DROP TABLE "interviews"`);
        await queryRunner.query(`DROP TABLE "interviewComments"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TABLE "credentialToken"`);
    }

}
