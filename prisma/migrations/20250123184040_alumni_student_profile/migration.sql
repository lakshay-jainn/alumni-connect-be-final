-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'STUDENT', 'ALUMNI');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'STUDENT';

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "DOB" TIMESTAMP(3) NOT NULL,
    "course" TEXT NOT NULL,
    "skills" TEXT[],
    "internships" TEXT[],
    "urls" TEXT[],
    "batch" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL DEFAULT 'https://ibb.co/5W6TpnY',
    "userId" TEXT NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL DEFAULT 'https://ibb.co/5W6TpnY',
    "batch" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "jobTitle" TEXT,
    "company" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AlumniProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniProfile_userId_key" ON "AlumniProfile"("userId");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniProfile" ADD CONSTRAINT "AlumniProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
