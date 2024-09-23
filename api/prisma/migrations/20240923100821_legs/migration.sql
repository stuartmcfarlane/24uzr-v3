-- CreateTable
CREATE TABLE `Leg` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `startBuoyId` INTEGER NOT NULL,
    `endBuoyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
