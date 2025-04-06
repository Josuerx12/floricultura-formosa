-- CreateTable
CREATE TABLE "order_preferences" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "from" TEXT,
    "to" TEXT,
    "message" TEXT,
    "phone" TEXT NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_bump" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "bump_product_id" INTEGER NOT NULL,
    "bump_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_bump_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_preferences" ADD CONSTRAINT "order_preferences_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_bump" ADD CONSTRAINT "order_bump_bump_product_id_fkey" FOREIGN KEY ("bump_product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
