/*
  Warnings:

  - The primary key for the `AllowedWords` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AllowedWords` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "AllowedWords_word_key";

-- AlterTable
ALTER TABLE "AllowedWords" DROP CONSTRAINT "AllowedWords_pkey",
DROP COLUMN "id",
ALTER COLUMN "isRealWord" DROP DEFAULT,
ADD CONSTRAINT "AllowedWords_pkey" PRIMARY KEY ("word");
