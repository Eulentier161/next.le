/*
  Warnings:

  - A unique constraint covering the columns `[word]` on the table `AllowedWords` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AllowedWords_word_key" ON "AllowedWords"("word");
