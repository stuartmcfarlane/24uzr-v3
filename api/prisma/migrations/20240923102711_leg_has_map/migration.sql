/*
  Warnings:

  - Added the required column `mapId` to the `Leg` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Leg` ADD COLUMN `mapId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Leg` ADD CONSTRAINT `Leg_mapId_fkey` FOREIGN KEY (`mapId`) REFERENCES `Map`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
