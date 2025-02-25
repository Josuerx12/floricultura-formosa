-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_address_id_fkey";

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "address_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
