/*
  Warnings:

  - You are about to drop the `AlumniProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AlumniProfile" DROP CONSTRAINT "AlumniProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- DropTable
DROP TABLE "AlumniProfile";

-- DropTable
DROP TABLE "StudentProfile";
