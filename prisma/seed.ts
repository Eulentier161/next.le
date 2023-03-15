import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { allowed, words } from "./words";

const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: { name: "Eulentier", email: "git@eule.wtf", password: await bcrypt.hash("password", 8) },
  });
  await prisma.allowedWords.createMany({
    data: [
      ...words.map((word) => ({ word, isRealWord: true })),
      ...allowed.map((word) => ({ word, isRealWord: false })),
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
