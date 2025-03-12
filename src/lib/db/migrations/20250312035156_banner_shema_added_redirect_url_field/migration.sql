/*
  Warnings:

  - Added the required column `redirect_url` to the `banners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "redirect_url" TEXT NOT NULL;
