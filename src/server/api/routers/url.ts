import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

export const urlRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const urlItem = await ctx.prisma.url.create({
        data: {
          id: uuidv4(),
          userId: input.userId ?? "",
        },
      });
      return urlItem;
    }),
});
