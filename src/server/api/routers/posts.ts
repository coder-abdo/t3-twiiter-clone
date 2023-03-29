import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { filteredUsers } from "~/utils/filterUserInfo";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";

// Create a new ratelimiter, that allows 3 requests per 1 minutes
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});
export const postsRouter = createTRPCRouter({
  getUserPosts: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          autherId: input.userId,
        },
        take: 100,
        orderBy: {
          createdAt: "desc",
        },
      });
      return posts;
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.autherId),
        limit: 100,
      })
    ).map(filteredUsers);
    return posts.map((post) => {
      const auhtor = users.find((user) => user.id === post.autherId);
      if (!auhtor)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author Is Not Found",
        });
      return {
        post,
        auhtor,
      };
    });
  }),
  create: privateProcedure
    .input(
      z.object({
        content: z
          .string()
          .nonempty("tweet should at least one character")
          .max(44),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const autherId = ctx.userId;
      const { success } = await ratelimit.limit(autherId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const post = await ctx.prisma.post.create({
        data: {
          autherId,
          content: input.content,
        },
      });
      return post;
    }),
});
