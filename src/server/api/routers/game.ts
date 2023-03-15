import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  getRandomWordId: protectedProcedure.query(async ({ ctx }) => {
    const where = { isRealWord: true };
    const count = await ctx.prisma.allowedWords.count({ where });
    const skip = Math.floor(Math.random() * count);
    return await ctx.prisma.allowedWords.findFirst({ where, skip, select: { id: true } });
  }),
  validateWord: protectedProcedure.input(z.object({ word: z.string() })).mutation(async ({ input, ctx }) => {
    return Boolean(await ctx.prisma.allowedWords.findUnique({ where: { word: input.word } }));
  }),
  validateCharacters: protectedProcedure
    .input(z.object({ winId: z.string(), guess: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      const winWord = await ctx.prisma.allowedWords.findUniqueOrThrow({ where: { id: input.winId } });
      if (input.guess.length < 5) throw new TRPCError({ code: "BAD_REQUEST" });

      // count how many of each letter are in the word
      const counts: { [key: string]: number } = {};
      for (const chr of winWord.word) counts[chr] = (counts[chr] || 0) + 1;

      for (let i = 0; i < 5; i++) {
        if (winWord.word[i] === input.guess[i]) {
          counts[winWord.word[i]!]--;
        }
      }

      return input.guess.map((char, idx) => {
        if (winWord.word[idx] === char) {
          return { char, validation: 2 };
        } else if (winWord.word.includes(char) && typeof counts[char] !== "undefined" && counts[char]! > 0) {
          counts[char]--;
          return { char, validation: 1 };
        } else return { char, validation: 0 };
      });
    }),
  getSolution: protectedProcedure.input(z.object({ winId: z.string() })).mutation(async ({ input, ctx }) => {
    return (await ctx.prisma.allowedWords.findUniqueOrThrow({ where: { id: input.winId }, select: { word: true } }))
      .word;
  }),
  increaseScore: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { score: { increment: 1 } },
      select: { score: true },
    });
  }),
});
