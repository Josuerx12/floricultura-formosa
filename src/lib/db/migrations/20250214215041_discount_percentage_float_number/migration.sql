/*
  Warnings:

  - You are about to alter the column `discount_percentage` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "promotions" ALTER COLUMN "discount_percentage" SET DATA TYPE DOUBLE PRECISION;
