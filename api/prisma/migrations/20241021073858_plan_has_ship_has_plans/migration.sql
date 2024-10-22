/*
  Warnings:

  - Added the required column `shipId` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Plan` ADD COLUMN `shipId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Plan` ADD CONSTRAINT `Plan_shipId_fkey` FOREIGN KEY (`shipId`) REFERENCES `Ship`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
