/*
  Warnings:

  - You are about to drop the column `workExperience` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "workExperience";

-- CreateTable
CREATE TABLE "workExperience" (
    "workId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "remote" BOOLEAN,
    "skills" TEXT[],
    "startDate" TEXT,
    "endDate" TEXT,
    "location" TEXT,
    "description" TEXT,
    "designation" TEXT,
    "organisation" TEXT,
    "employmentType" TEXT,
    "currentlyWorking" BOOLEAN,

    CONSTRAINT "workExperience_pkey" PRIMARY KEY ("workId")
);

-- AddForeignKey
ALTER TABLE "workExperience" ADD CONSTRAINT "workExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
