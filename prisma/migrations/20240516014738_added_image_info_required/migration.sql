/*
  Warnings:

  - Made the column `imageName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "imageName" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;
