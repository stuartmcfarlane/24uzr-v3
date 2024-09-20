/*
  Warnings:

  - You are about to drop the `Bouy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Bouy` DROP FOREIGN KEY `Bouy_mapId_fkey`;

-- DropTable
DROP TABLE `Bouy`;

-- CreateTable
CREATE TABLE `Buoy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(128) NOT NULL,
    `lat` DECIMAL(10, 8) NOT NULL,
    `lng` DECIMAL(11, 8) NOT NULL,
    `mapId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Buoy` ADD CONSTRAINT `Buoy_mapId_fkey` FOREIGN KEY (`mapId`) REFERENCES `Map`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
