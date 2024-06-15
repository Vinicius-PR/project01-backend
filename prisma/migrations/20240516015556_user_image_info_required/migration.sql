/*
  Warnings:

  - Made the column `imageUserName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUserUrl` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "imageUserName" SET NOT NULL,
ALTER COLUMN "imageUserUrl" SET NOT NULL;
