-- CreateTable
CREATE TABLE `WindContours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `lat1` DOUBLE NOT NULL,
    `lng1` DOUBLE NOT NULL,
    `lat2` DOUBLE NOT NULL,
    `lng2` DOUBLE NOT NULL,
    `levels` JSON NOT NULL,
    `contours` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
