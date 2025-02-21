/*
  Warnings:

  - You are about to drop the column `profileImage` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" DROP COLUMN "profileImage";

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "profileImage";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT NOT NULL DEFAULT 'https://ibb.co/5W6TpnY';
