-- DropForeignKey
ALTER TABLE `LegsOnRoute` DROP FOREIGN KEY `LegsOnRoute_routeId_fkey`;

-- DropForeignKey
ALTER TABLE `Route` DROP FOREIGN KEY `Route_planId_fkey`;

-- AddForeignKey
ALTER TABLE `Route` ADD CONSTRAINT `Route_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LegsOnRoute` ADD CONSTRAINT `LegsOnRoute_routeId_fkey` FOREIGN KEY (`routeId`) REFERENCES `Route`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
