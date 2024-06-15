/*
  Warnings:

  - Added the required column `imageProductName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageProductUrl` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageProductName" TEXT NOT NULL,
ADD COLUMN     "imageProductUrl" TEXT NOT NULL;
