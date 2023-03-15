/*
  Warnings:

  - You are about to drop the `Word` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Word";

-- CreateTable
CREATE TABLE "AllowedWords" (
    "id" TEXT NOT NULL,
    "word" VARCHAR(5) NOT NULL,
    "isRealWord" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AllowedWords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllowedWords_word_key" ON "AllowedWords"("word");
