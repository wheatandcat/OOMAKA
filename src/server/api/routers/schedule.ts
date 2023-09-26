import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const scheduleRouter = createTRPCRouter({
  fetch: publicProcedure
    .input(
      z.object({
        urlId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const schedules = await ctx.prisma.schedule.findMany({
        where: {
          urlId: input.urlId,
        },
        orderBy: {
          day: "asc",
        },
      });
      return schedules;
    }),
  fetchInPeriod: publicProcedure
    .input(
      z.object({
        urlId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const schedules = await ctx.prisma.schedule.findMany({
        where: {
          urlId: input.urlId,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        orderBy: {
          day: "asc",
        },
      });
      return schedules;
    }),
  create: publicProcedure
    .input(
      z.object({
        urlId: z.string(),
        day: z.number(),
        date: z.date(),
        emoji: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const schedule = await ctx.prisma.schedule.create({
        data: {
          urlId: input.urlId,
          day: input.day,
          date: input.date,
          emoji: input.emoji,
          text: input.text,
        },
      });
      return schedule;
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const schedule = await ctx.prisma.schedule.delete({
        where: {
          id: input.id,
        },
      });
      return schedule;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        urlId: z.string(),
        day: z.number(),
        date: z.date(),
        emoji: z.string(),
        text: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const schedule = await ctx.prisma.schedule.update({
        where: {
          id: input.id,
        },
        data: {
          urlId: input.urlId,
          day: input.day,
          date: input.date,
          emoji: input.emoji,
          text: input.text,
        },
      });
      return schedule;
    }),
});
