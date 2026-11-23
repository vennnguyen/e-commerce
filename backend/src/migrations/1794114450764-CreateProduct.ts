import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProduct1794114450764 implements MigrationInterface {
  name = 'CreateProduct1794114450764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_product_featured"`);
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "rating_avergage" TO "rating_average"`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variant" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "product_id" uuid NOT NULL, "sku" character varying(255) NOT NULL, "barcode" character varying(255), "price" numeric(18,2), "compare_at_price" numeric(18,2), "stock_quantity" integer NOT NULL DEFAULT '0', "low_stock_threshold" integer NOT NULL DEFAULT '0', "weight" numeric(18,2), "slug" character varying(255), "image_url" character varying(1024), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_f4dc2c0888b66d547c175f090e2" UNIQUE ("sku"), CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca67dd080aac5ecf99609960cd" ON "product_variant"  ("product_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "variant_option_value" ("variant_id" uuid NOT NULL, "option_value_id" uuid NOT NULL, CONSTRAINT "PK_0ceec263f89f675977e79f3a570" PRIMARY KEY ("variant_id", "option_value_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_78c6c6ae10eb1caba05ec3d77b" ON "variant_option_value"  ("option_value_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_option_value" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "option_id" uuid NOT NULL, "value" character varying(255) NOT NULL, "label" character varying(255) NOT NULL, "price_modifier" numeric(18,2), "display_order" integer NOT NULL DEFAULT '0', "metadata" jsonb, CONSTRAINT "PK_2ab71ed3b21be5800905c621535" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cdf4388f294b30a25c627d69fe" ON "product_option_value"  ("option_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_option" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "product_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "display_order" integer NOT NULL DEFAULT '0', "type" character varying(50) NOT NULL DEFAULT 'text', CONSTRAINT "PK_4cf3c467e9bc764bdd32c4cd938" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e634fca34f6b594b87fdbee95f" ON "product_option"  ("product_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_attribute" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "product_id" uuid NOT NULL, "attr_key" character varying(255) NOT NULL, "attr_value" text NOT NULL, "attr_group" character varying(255), "display_order" integer NOT NULL DEFAULT '0', "is_filterable" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f9b91f38df3dbbe481d9e056e5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8f119684d209b55cf5e8b4253" ON "product_attribute"  ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "is_featured" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "has_variants" SET DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_product_feartured" ON "product"  ("is_featured") WHERE "is_featured" = true AND "is_active" = true AND "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_ca67dd080aac5ecf99609960cd2" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "variant_option_value" ADD CONSTRAINT "FK_cbdcaab5a11d468074168195934" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "variant_option_value" ADD CONSTRAINT "FK_78c6c6ae10eb1caba05ec3d77bd" FOREIGN KEY ("option_value_id") REFERENCES "product_option_value"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_option_value" ADD CONSTRAINT "FK_cdf4388f294b30a25c627d69fe9" FOREIGN KEY ("option_id") REFERENCES "product_option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_option" ADD CONSTRAINT "FK_e634fca34f6b594b87fdbee95f6" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_attribute" ADD CONSTRAINT "FK_c8f119684d209b55cf5e8b42532" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_attribute" DROP CONSTRAINT "FK_c8f119684d209b55cf5e8b42532"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_option" DROP CONSTRAINT "FK_e634fca34f6b594b87fdbee95f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_option_value" DROP CONSTRAINT "FK_cdf4388f294b30a25c627d69fe9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "variant_option_value" DROP CONSTRAINT "FK_78c6c6ae10eb1caba05ec3d77bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "variant_option_value" DROP CONSTRAINT "FK_cbdcaab5a11d468074168195934"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_ca67dd080aac5ecf99609960cd2"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_product_feartured"`);
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "has_variants" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "is_featured" SET DEFAULT true`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8f119684d209b55cf5e8b4253"`,
    );
    await queryRunner.query(`DROP TABLE "product_attribute"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e634fca34f6b594b87fdbee95f"`,
    );
    await queryRunner.query(`DROP TABLE "product_option"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cdf4388f294b30a25c627d69fe"`,
    );
    await queryRunner.query(`DROP TABLE "product_option_value"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_78c6c6ae10eb1caba05ec3d77b"`,
    );
    await queryRunner.query(`DROP TABLE "variant_option_value"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca67dd080aac5ecf99609960cd"`,
    );
    await queryRunner.query(`DROP TABLE "product_variant"`);
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "rating_average" TO "rating_avergage"`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_product_featured" ON "product" USING btree ("is_featured") WHERE ((is_featured = true) AND (is_active = true) AND (deleted_at IS NULL))`,
    );
  }
}
