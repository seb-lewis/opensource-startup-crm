/*
  Warnings:

  - You are about to drop the column `addressId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `billingAddressId` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "QuoteBillingAddress_fk";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "QuoteShippingAddress_fk";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "addressId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT;

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "accountId",
DROP COLUMN "addressId",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "billingAddressId",
DROP COLUMN "shippingAddressId",
ADD COLUMN     "billingCity" TEXT,
ADD COLUMN     "billingCountry" TEXT,
ADD COLUMN     "billingPostalCode" TEXT,
ADD COLUMN     "billingState" TEXT,
ADD COLUMN     "billingStreet" TEXT,
ADD COLUMN     "shippingCity" TEXT,
ADD COLUMN     "shippingCountry" TEXT,
ADD COLUMN     "shippingPostalCode" TEXT,
ADD COLUMN     "shippingState" TEXT,
ADD COLUMN     "shippingStreet" TEXT;

-- DropTable
DROP TABLE "Address";

-- CreateTable
CREATE TABLE "AccountContactRelationship" (
    "id" TEXT NOT NULL,
    "role" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "accountId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountContactRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountContactRelationship_contactId_idx" ON "AccountContactRelationship"("contactId");

-- CreateIndex
CREATE INDEX "AccountContactRelationship_accountId_idx" ON "AccountContactRelationship"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountContactRelationship_contactId_accountId_key" ON "AccountContactRelationship"("contactId", "accountId");

-- AddForeignKey
ALTER TABLE "AccountContactRelationship" ADD CONSTRAINT "AccountContactRelationship_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountContactRelationship" ADD CONSTRAINT "AccountContactRelationship_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
