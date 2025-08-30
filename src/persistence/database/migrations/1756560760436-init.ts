import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1756560760436 implements MigrationInterface {
  name = 'Init1756560760436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."permissions_subject_enum" AS ENUM('user', 'role', 'auth', 'product', 'category', 'order')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."permissions_actions_enum" AS ENUM('manage', 'read', 'create', 'update', 'delete')`
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("role_id" uuid NOT NULL, "subject" "public"."permissions_subject_enum" NOT NULL, "actions" "public"."permissions_actions_enum" array NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c17d39de1f7227783085bf3dbe3" PRIMARY KEY ("role_id", "subject"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."roles_type_enum" AS ENUM('super_admin', 'admin', 'vendor', 'customer')`
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "is_active" boolean NOT NULL DEFAULT true, "type" "public"."roles_type_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "UQ_ff503f858b61860b2b7d7a55ceb" UNIQUE ("type"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_ff503f858b61860b2b7d7a55ce" ON "roles" ("type") `);
    await queryRunner.query(`CREATE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "name_vector" tsvector NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `
          CREATE FUNCTION plainto_tsquery_prefix(config regconfig, document text) RETURNS tsquery
          AS
          '
            SELECT CASE
              WHEN numnode(plainto_tsquery(config, DOCUMENT)) = 0 THEN ''''::tsquery
              ELSE to_tsquery(config, plainto_tsquery(config, DOCUMENT)::TEXT || '':*'')
              END;
          '
          LANGUAGE SQL
          IMMUTABLE
          RETURNS NULL ON NULL INPUT;
        `
    );
    //#endregion

    // #region manual
    await queryRunner.query(`CREATE INDEX ix_users__name_vector ON users USING gin(name_vector);`);
    await queryRunner.query(
      `CREATE FUNCTION set_users_name_vector() RETURNS trigger
        LANGUAGE plpgsql
      AS
      $$
      BEGIN
        NEW.name_vector := to_tsvector('simple', NEW.name);
        RETURN NEW;
      END
      $$;`
    );
    await queryRunner.query(
      `CREATE TRIGGER set_users_name_vector
        BEFORE INSERT OR UPDATE
          OF name
        ON users
        FOR EACH ROW
      EXECUTE PROCEDURE set_users_name_vector();`
    );
    await queryRunner.query(`UPDATE users SET name_vector = to_tsvector('simple', name);`);
    // #endregion
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //#region manual
    await queryRunner.query(`DROP FUNCTION plainto_tsquery_prefix`);
    //#endregion

    // #region manual
    await queryRunner.query(`DROP TRIGGER set_users_name_vector ON users;`);
    await queryRunner.query(`DROP FUNCTION set_users_name_vector;`);
    await queryRunner.query(`DROP INDEX ix_users__name_vector;`);
    // #endregion

    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
    await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_f10931e7bb05a3b434642ed2797"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ff503f858b61860b2b7d7a55ce"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TYPE "public"."roles_type_enum"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TYPE "public"."permissions_actions_enum"`);
    await queryRunner.query(`DROP TYPE "public"."permissions_subject_enum"`);
  }
}
