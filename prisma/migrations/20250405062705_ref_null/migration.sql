/*
  Warnings:

  - Made the column `profileCompletionPercentage` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profileCompletionPercentage` on table `StudentProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" ALTER COLUMN "profileCompletionPercentage" SET NOT NULL,
ALTER COLUMN "batch" DROP NOT NULL,
ALTER COLUMN "batch" DROP DEFAULT;

-- AlterTable
ALTER TABLE "StudentProfile" ALTER COLUMN "batch" DROP NOT NULL,
ALTER COLUMN "batch" DROP DEFAULT,
ALTER COLUMN "profileCompletionPercentage" SET NOT NULL;
