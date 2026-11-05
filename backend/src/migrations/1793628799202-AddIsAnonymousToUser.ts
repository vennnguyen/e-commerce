import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAnonymousToUser1793628799202 implements MigrationInterface {
  name = 'AddIsAnonymousToUser1793628799202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_anonymous" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT true`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_anonymous"`);
  }
}
