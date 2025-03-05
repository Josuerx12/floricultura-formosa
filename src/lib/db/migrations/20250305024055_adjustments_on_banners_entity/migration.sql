/*
  Warnings:

  - You are about to drop the column `createdAt` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `banners` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `banners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banners" DROP COLUMN "createdAt",
DROP COLUMN "image",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
