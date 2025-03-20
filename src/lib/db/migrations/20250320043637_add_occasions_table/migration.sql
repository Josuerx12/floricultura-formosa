-- AlterTable
ALTER TABLE "product" ADD COLUMN     "occasions_id" INTEGER;

-- CreateTable
CREATE TABLE "occasions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "occasions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_occasions_id_fkey" FOREIGN KEY ("occasions_id") REFERENCES "occasions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
