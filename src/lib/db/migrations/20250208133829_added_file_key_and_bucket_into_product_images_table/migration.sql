/*
  Warnings:

  - Added the required column `bucket` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_key` to the `product_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "bucket" TEXT NOT NULL,
ADD COLUMN     "file_key" TEXT NOT NULL;
