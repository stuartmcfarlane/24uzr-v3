/*
  Warnings:

  - Added the required column `mapId` to the `Bouy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bouy` ADD COLUMN `mapId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Bouy` ADD CONSTRAINT `Bouy_mapId_fkey` FOREIGN KEY (`mapId`) REFERENCES `Map`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
