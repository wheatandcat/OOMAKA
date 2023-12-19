import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";

export const urlRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = {
        id: uuidv4(),
        userId: input.userId ?? "",
      };

      console.log("data:", data);

      return ctx.db.url.create({
        data,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
        password: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId !== ctx.session?.user?.id) {
        throw new Error("ユーザー情報が一致しないので更新できません");
      }

      const urlItem = await ctx.db.url.update({
        where: {
          id: input.id,
        },
        data: {
          password: input.password,
        },
      });

      return urlItem;
    }),
  exists: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const urlItem = await ctx.db.url.findUnique({
        where: {
          id: input.id,
        },
      });
      return urlItem;
    }),
  existsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const urlItem = await ctx.db.url.findFirst({
        where: {
          userId: input.userId,
        },
      });

      return urlItem;
    }),

  test: protectedProcedure.query(() => {
    return "test";
  }),
});
