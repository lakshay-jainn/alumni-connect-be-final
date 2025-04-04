/*
  Warnings:

  - You are about to drop the column `DOB` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `batch` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `course` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `DOB` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `course` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" DROP COLUMN "DOB",
DROP COLUMN "batch",
DROP COLUMN "company",
DROP COLUMN "course",
DROP COLUMN "jobTitle",
DROP COLUMN "name",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "achievements" JSONB[],
ADD COLUMN     "banner" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "basic" JSONB[],
ADD COLUMN     "certificates" JSONB[],
ADD COLUMN     "education" JSONB[],
ADD COLUMN     "personalDetails" JSONB[],
ADD COLUMN     "profileCompletionPercentage" TEXT,
ADD COLUMN     "projects" JSONB[],
ADD COLUMN     "resume" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "socialLinks" JSONB[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "DOB",
DROP COLUMN "course",
DROP COLUMN "name",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "achievements" JSONB[],
ADD COLUMN     "banner" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "basic" JSONB[],
ADD COLUMN     "certificates" JSONB[],
ADD COLUMN     "education" JSONB[],
ADD COLUMN     "personalDetails" JSONB[],
ADD COLUMN     "profileCompletionPercentage" TEXT,
ADD COLUMN     "projects" JSONB[],
ADD COLUMN     "resume" TEXT,
ADD COLUMN     "socialLinks" JSONB[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
