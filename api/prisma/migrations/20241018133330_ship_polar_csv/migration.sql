/*
  Warnings:

  - You are about to drop the `ShipPolar` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `polar` to the `Ship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ShipPolar` DROP FOREIGN KEY `ShipPolar_shipId_fkey`;

-- AlterTable
ALTER TABLE `Ship` ADD COLUMN `polar` MEDIUMTEXT NOT NULL;

-- DropTable
DROP TABLE `ShipPolar`;
