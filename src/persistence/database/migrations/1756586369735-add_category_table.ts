import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryTable1756586369735 implements MigrationInterface {
  name = 'AddCategoryTable1756586369735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "name_vector" tsvector NOT NULL, "slug" character varying NOT NULL, "description" character varying, "is_active" boolean NOT NULL DEFAULT true, "order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "mpath" character varying DEFAULT '', "parentId" uuid, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_34904c2a449e754abe18df84db" ON "categories" ("name", "slug", "is_active", "order") `
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );

    // #region manual
    await queryRunner.query(`CREATE INDEX ix_categories__name_vector ON categories USING gin(name_vector);`);
    await queryRunner.query(
      `CREATE FUNCTION set_categories_name_vector() RETURNS trigger
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
      `CREATE TRIGGER set_categories_name_vector
        BEFORE INSERT OR UPDATE
          OF name
        ON categories
        FOR EACH ROW
      EXECUTE PROCEDURE set_categories_name_vector();`
    );
    await queryRunner.query(`UPDATE categories SET name_vector = to_tsvector('simple', name);`);
    // #endregion
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // #region manual
    await queryRunner.query(`DROP TRIGGER set_categories_name_vector ON categories;`);
    await queryRunner.query(`DROP FUNCTION set_categories_name_vector;`);
    await queryRunner.query(`DROP INDEX ix_categories__name_vector;`);
    // #endregion

    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_34904c2a449e754abe18df84db"`);
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
