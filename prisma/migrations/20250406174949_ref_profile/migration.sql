/*
  Warnings:

  - Made the column `banner` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "banner" SET NOT NULL,
ALTER COLUMN "banner" SET DEFAULT 'https://static.licdn.com/aero-v1/sc/h/55k1z8997gh8dwtihm11aajyq';
