import type { GetStaticProps, NextPage } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import Image from "next/image";
import Loader from "~/components/loader";
import { PostsView } from "~/components/Posts.component";
type PageProps = { username: string };
const ProfilePage: NextPage<PageProps> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUserName.useQuery({
    username,
  });
  const { data: posts, isLoading: postsLoading } =
    api.posts.getUserPosts.useQuery({
      userId: data?.id as string,
    });
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>{data?.username}</title>
        <meta name="profile page" content="profile page details" />
      </Head>
      <PageLayout>
        <div className="relative h-48 bg-slate-500 text-slate-100">
          <Image
            src={data?.profileImageUrl ?? ""}
            alt={data?.username ?? ""}
            width={96}
            height={96}
            className="absolute bottom-0 left-0 -mb-[48px] ml-4 h-32 w-32 rounded-full border-2 border-black"
          />
        </div>
        <h1 className="text-md mt-16 mb-4 pl-3">@{data?.username}</h1>
        <hr className="border-b-1 border-slate-100" />
        {postsLoading && (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}
        <div className="px-2 py-4">
          {posts?.map((post) => (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <PostsView key={post.id} post={post} auhtor={data!} />
          ))}
        </div>
      </PageLayout>
    </>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });
  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("invalid slug");
  const username = slug.replace("@", "");
  await ssg.profile.getUserByUserName.prefetch({
    username,
  });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};
export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export default ProfilePage;
