/*
  Warnings:

  - Added the required column `name` to the `Geometry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Geometry` ADD COLUMN `name` VARCHAR(128) NOT NULL;
