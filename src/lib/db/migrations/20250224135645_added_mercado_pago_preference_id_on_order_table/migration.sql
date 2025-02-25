/*
  Warnings:

  - Added the required column `mercado_pago_preference_id` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "mercado_pago_preference_id" TEXT NOT NULL;
