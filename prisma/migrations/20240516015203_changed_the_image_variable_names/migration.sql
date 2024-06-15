/*
  Warnings:

  - You are about to drop the column `imageName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageName",
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUserName" TEXT,
ADD COLUMN     "imageUserUrl" TEXT;
