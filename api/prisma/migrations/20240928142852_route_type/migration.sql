/*
  Warnings:

  - Added the required column `type` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Route` ADD COLUMN `type` ENUM('USER', 'SHORTEST') NOT NULL;

-- AddForeignKey
ALTER TABLE `LegsOnRoute` ADD CONSTRAINT `LegsOnRoute_legId_fkey` FOREIGN KEY (`legId`) REFERENCES `Leg`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
