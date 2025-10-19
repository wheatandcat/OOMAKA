import bcrypt from "bcrypt";
import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
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

			let hashedPassword = null;
			if (String(input?.password) !== "") {
				hashedPassword = await bcrypt.hash(String(input.password), 10);
			}

			const urlItem = await ctx.db.url.update({
				where: {
					id: input.id,
				},
				data: {
					userId: input.userId,
					password: hashedPassword,
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
	checkPassword: publicProcedure
		.input(
			z.object({
				id: z.string(),
				password: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const urlItem = await ctx.db.url.findUnique({
				where: {
					id: input.id,
				},
			});

			const ok = await bcrypt.compare(
				input.password,
				String(urlItem?.password),
			);

			return ok;
		}),
});
