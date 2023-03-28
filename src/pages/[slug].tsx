import type { GetStaticProps, NextPage } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import Image from "next/image";
type PageProps = { username: string };
const ProfilePage: NextPage<PageProps> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUserName.useQuery({
    username,
  });
  console.log(data, isLoading);
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
          <h1>user profile {data?.username}</h1>
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
