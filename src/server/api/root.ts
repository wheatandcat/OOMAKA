import { exampleRouter } from "~/server/api/routers/example";
import { scheduleRouter } from "~/server/api/routers/schedule";
import { urlRouter } from "~/server/api/routers/url";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  schedule: scheduleRouter,
  url: urlRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
