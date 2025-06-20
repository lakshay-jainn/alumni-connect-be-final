/*
  Warnings:

  - Made the column `remote` on table `workExperience` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "workExperience" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "remote" SET NOT NULL;
