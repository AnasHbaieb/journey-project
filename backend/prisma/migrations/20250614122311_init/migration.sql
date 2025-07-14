/*
  Warnings:

  - You are about to drop the column `codeVerfifcation` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "codeVerfifcation",
ADD COLUMN     "codeVerfication" INTEGER;
