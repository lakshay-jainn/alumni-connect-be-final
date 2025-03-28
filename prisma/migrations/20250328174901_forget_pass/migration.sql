-- AlterTable
ALTER TABLE "AlumniProfile" ADD COLUMN     "enrolmentNumber" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "enrolmentNumber" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "tokenSendAt" TEXT;
