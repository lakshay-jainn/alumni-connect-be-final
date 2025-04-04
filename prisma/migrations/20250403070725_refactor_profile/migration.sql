/*
  Warnings:

  - The `achievements` column on the `AlumniProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `basic` column on the `AlumniProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `certificates` column on the `AlumniProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `education` column on the `AlumniProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `personalDetails` column on the `AlumniProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `projects` column on the `AlumniProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `socialLinks` column on the `AlumniProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `achievements` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `basic` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `certificates` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `education` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `personalDetails` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `projects` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `socialLinks` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" ALTER COLUMN "enrolmentNumber" DROP NOT NULL,
ALTER COLUMN "enrolmentNumber" DROP DEFAULT,
DROP COLUMN "achievements",
ADD COLUMN     "achievements" JSONB,
ALTER COLUMN "banner" DROP NOT NULL,
ALTER COLUMN "banner" DROP DEFAULT,
DROP COLUMN "basic",
ADD COLUMN     "basic" JSONB,
DROP COLUMN "certificates",
ADD COLUMN     "certificates" JSONB,
DROP COLUMN "education",
ADD COLUMN     "education" JSONB,
DROP COLUMN "personalDetails",
ADD COLUMN     "personalDetails" JSONB,
DROP COLUMN "projects",
ADD COLUMN     "projects" JSONB,
DROP COLUMN "socialLinks",
ADD COLUMN     "socialLinks" JSONB;

-- AlterTable
ALTER TABLE "StudentProfile" ALTER COLUMN "enrolmentNumber" DROP NOT NULL,
ALTER COLUMN "enrolmentNumber" DROP DEFAULT,
DROP COLUMN "achievements",
ADD COLUMN     "achievements" JSONB,
ALTER COLUMN "banner" DROP NOT NULL,
ALTER COLUMN "banner" DROP DEFAULT,
DROP COLUMN "basic",
ADD COLUMN     "basic" JSONB,
DROP COLUMN "certificates",
ADD COLUMN     "certificates" JSONB,
DROP COLUMN "education",
ADD COLUMN     "education" JSONB,
DROP COLUMN "personalDetails",
ADD COLUMN     "personalDetails" JSONB,
DROP COLUMN "projects",
ADD COLUMN     "projects" JSONB,
DROP COLUMN "socialLinks",
ADD COLUMN     "socialLinks" JSONB;
