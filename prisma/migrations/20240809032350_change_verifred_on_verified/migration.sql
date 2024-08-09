/*
  Warnings:

  - You are about to drop the column `isEmailVerifed` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "isEmailVerifed",
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
