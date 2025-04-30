/*
  Warnings:

  - The values [SU] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isPrimary` on the `UserOrganization` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'USER', 'SALES_REP', 'SUPPORT_REP', 'READ_ONLY');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "UserOrganization" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TABLE "UserOrganization" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'READ_ONLY';
ALTER TABLE "UserOrganization" ALTER COLUMN "role" SET DEFAULT 'READ_ONLY';
COMMIT;

-- AlterTable
ALTER TABLE "UserOrganization" DROP COLUMN "isPrimary";
