/*
  Warnings:

  - Added the required column `startTime` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Plan` ADD COLUMN `startTime` DATETIME(3) NOT NULL;
