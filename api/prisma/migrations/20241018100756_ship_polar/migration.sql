-- CreateTable
CREATE TABLE `ShipPolar` (
    `shipId` INTEGER NOT NULL,
    `windKnots` INTEGER NOT NULL,
    `windDegrees` INTEGER NOT NULL,
    `boatMs` DOUBLE NOT NULL,

    INDEX `ShipPolar_shipId_idx`(`shipId`),
    PRIMARY KEY (`shipId`, `windKnots`, `windDegrees`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShipPolar` ADD CONSTRAINT `ShipPolar_shipId_fkey` FOREIGN KEY (`shipId`) REFERENCES `Ship`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
