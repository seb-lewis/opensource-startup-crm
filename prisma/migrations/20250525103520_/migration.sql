/*
  Warnings:

  - You are about to drop the column `authorId` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `BlogPost` table. All the data in the column will be lost.
  - Added the required column `seoDescription` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seoTitle` to the `BlogPost` table without a default value. This is not possible if the table is not empty.
  - Made the column `excerpt` on table `BlogPost` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ContentBlockType" AS ENUM ('MARKDOWN', 'CODE', 'IMAGE');

-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_authorId_fkey";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "authorId",
DROP COLUMN "content",
DROP COLUMN "published",
ADD COLUMN     "draft" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seoDescription" TEXT NOT NULL,
ADD COLUMN     "seoTitle" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "excerpt" SET NOT NULL;

-- CreateTable
CREATE TABLE "BlogContentBlock" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "type" "ContentBlockType" NOT NULL,
    "content" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogContentBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogContentBlock" ADD CONSTRAINT "BlogContentBlock_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
