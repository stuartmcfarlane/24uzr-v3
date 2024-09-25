/*
  Warnings:

  - Added the required column `buoyId` to the `Leg` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Leg` ADD COLUMN `buoyId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Leg` ADD CONSTRAINT `Leg_startBuoyId_fkey` FOREIGN KEY (`startBuoyId`) REFERENCES `Buoy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leg` ADD CONSTRAINT `Leg_endBuoyId_fkey` FOREIGN KEY (`endBuoyId`) REFERENCES `Buoy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_startBuoyId_fkey` FOREIGN KEY (`startBuoyId`) REFERENCES `Buoy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_endBuoyId_fkey` FOREIGN KEY (`endBuoyId`) REFERENCES `Buoy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
