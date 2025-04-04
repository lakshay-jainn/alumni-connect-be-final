/*
  Warnings:

  - You are about to drop the column `achievements` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `certificates` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `projects` on the `AlumniProfile` table. All the data in the column will be lost.
  - You are about to drop the column `achievements` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `certificates` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `internships` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `projects` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" DROP COLUMN "achievements",
DROP COLUMN "certificates",
DROP COLUMN "projects",
ADD COLUMN     "accomplishments" JSONB,
ADD COLUMN     "batch" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "urls" TEXT[],
ADD COLUMN     "workExperience" JSONB;

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "achievements",
DROP COLUMN "certificates",
DROP COLUMN "internships",
DROP COLUMN "projects",
ADD COLUMN     "accomplishments" JSONB,
ADD COLUMN     "workExperience" JSONB;
