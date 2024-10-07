-- CreateTable
CREATE TABLE `Wind` (
    `timestamp` DATETIME(3) NOT NULL,
    `lat` DECIMAL(10, 8) NOT NULL,
    `lng` DECIMAL(11, 8) NOT NULL,
    `u` DOUBLE NOT NULL,
    `v` DOUBLE NOT NULL,

    PRIMARY KEY (`timestamp`, `lat`, `lng`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
