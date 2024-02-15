/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `ShoppingCart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `ShoppingCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_id_fkey";

-- AlterTable
ALTER TABLE "ShoppingCart" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingCart_ownerId_key" ON "ShoppingCart"("ownerId");

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
