import { type User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
const filteredUsers = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};
export const postsRouter = createTRPCRouter({
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
        content: z.string().nonempty().max(44),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const autherId = ctx.userId;
      const post = await ctx.prisma.post.create({
        data: {
          autherId,
          content: input.content,
        },
      });
      return post;
    }),
});
