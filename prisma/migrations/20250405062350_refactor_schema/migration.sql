/*
  Warnings:

  - You are about to drop the column `enrolmentNumber` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `urls` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `enrolmentNumber` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `urls` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" DROP COLUMN "enrolmentNumber",
DROP COLUMN "urls",
ADD COLUMN     "enrollmentNumber" TEXT,
ALTER COLUMN "profileCompletionPercentage" SET DEFAULT '0';

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "enrolmentNumber",
DROP COLUMN "urls",
ADD COLUMN     "enrollmentNumber" TEXT,
ALTER COLUMN "profileCompletionPercentage" SET DEFAULT '0';
