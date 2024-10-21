/*
  Warnings:

  - You are about to alter the column `lat` on the `Buoy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Double`.
  - You are about to alter the column `lng` on the `Buoy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `Double`.
  - You are about to alter the column `lat1` on the `Map` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Double`.
  - You are about to alter the column `lat2` on the `Map` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Double`.
  - You are about to alter the column `lng1` on the `Map` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `Double`.
  - You are about to alter the column `lng2` on the `Map` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `Double`.
  - The primary key for the `Wind` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `lat` on the `Wind` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `Double`.
  - You are about to alter the column `lng` on the `Wind` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Buoy` MODIFY `lat` DOUBLE NOT NULL,
    MODIFY `lng` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `Map` MODIFY `lat1` DOUBLE NOT NULL,
    MODIFY `lat2` DOUBLE NOT NULL,
    MODIFY `lng1` DOUBLE NOT NULL,
    MODIFY `lng2` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `Wind` DROP PRIMARY KEY,
    MODIFY `lat` DOUBLE NOT NULL,
    MODIFY `lng` DOUBLE NOT NULL,
    ADD PRIMARY KEY (`timestamp`, `lat`, `lng`);
