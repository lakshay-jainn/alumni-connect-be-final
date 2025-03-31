/*
  Warnings:

  - You are about to drop the column `passwordResetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenSendAt` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_passwordResetToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordResetToken",
DROP COLUMN "tokenSendAt";
