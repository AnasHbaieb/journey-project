/*
  Warnings:

  - You are about to drop the column `about` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `domaine` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "about",
DROP COLUMN "domaine",
DROP COLUMN "education";
