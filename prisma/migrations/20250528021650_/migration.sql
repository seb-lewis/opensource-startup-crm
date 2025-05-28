-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('SUCCESS', 'FAILED', 'IN_PROGRESS');

-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "status" "OpportunityStatus";
