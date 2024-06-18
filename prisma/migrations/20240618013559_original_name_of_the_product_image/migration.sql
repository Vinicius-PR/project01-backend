/*
  Warnings:

  - Added the required column `imageProductOriginalName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageProductOriginalName" TEXT NOT NULL;
