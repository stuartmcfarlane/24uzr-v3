/*
  Warnings:

  - Made the column `lat1` on table `Map` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lat2` on table `Map` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lng1` on table `Map` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lng2` on table `Map` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Map` MODIFY `lat1` DECIMAL(10, 8) NOT NULL DEFAULT 0,
    MODIFY `lat2` DECIMAL(10, 8) NOT NULL DEFAULT 0,
    MODIFY `lng1` DECIMAL(11, 8) NOT NULL DEFAULT 0,
    MODIFY `lng2` DECIMAL(11, 8) NOT NULL DEFAULT 0;
