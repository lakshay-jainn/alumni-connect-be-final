/*
  Warnings:

  - The primary key for the `AlumniProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AlumniProfile` table. All the data in the column will be lost.
  - The primary key for the `StudentProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StudentProfile` table. All the data in the column will be lost.
  - Made the column `jobTitle` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company` on table `AlumniProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AlumniProfile" DROP CONSTRAINT "AlumniProfile_pkey",
DROP COLUMN "id",
ADD COLUMN     "DOB" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "batch" SET DEFAULT '',
ALTER COLUMN "course" SET DEFAULT '',
ALTER COLUMN "jobTitle" SET NOT NULL,
ALTER COLUMN "jobTitle" SET DEFAULT '',
ALTER COLUMN "company" SET NOT NULL,
ALTER COLUMN "company" SET DEFAULT '';

-- AlterTable
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_pkey",
DROP COLUMN "id",
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "DOB" SET DEFAULT '',
ALTER COLUMN "DOB" SET DATA TYPE TEXT,
ALTER COLUMN "course" SET DEFAULT '',
ALTER COLUMN "batch" SET DEFAULT '';
