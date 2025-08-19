/*
  Warnings:

  - You are about to drop the column `batch` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Community` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "role" "ROLE"[];

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "batch",
ADD COLUMN     "startYear" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rollNumber" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "url" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_userId_key" ON "Notification"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
