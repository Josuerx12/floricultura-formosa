-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_subcategory_id_fkey";

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "subcategory"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
