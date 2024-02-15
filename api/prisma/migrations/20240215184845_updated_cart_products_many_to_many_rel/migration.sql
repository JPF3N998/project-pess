/*
  Warnings:

  - You are about to drop the column `shoppingCartId` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_shoppingCartId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "shoppingCartId";

-- CreateTable
CREATE TABLE "ProductsOnShoppingCart" (
    "shoppingCartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductsOnShoppingCart_pkey" PRIMARY KEY ("shoppingCartId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ProductsOnShoppingCart" ADD CONSTRAINT "ProductsOnShoppingCart_shoppingCartId_fkey" FOREIGN KEY ("shoppingCartId") REFERENCES "ShoppingCart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsOnShoppingCart" ADD CONSTRAINT "ProductsOnShoppingCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
