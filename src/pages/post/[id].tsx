import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Loader from "~/components/loader";
import { PostsView } from "~/components/Posts.component";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/generateSSgHelper";
type PageProps = {
  postId: string;
};
const PostPage: NextPage<PageProps> = ({ postId }) => {
  const { data: post, isLoading: isPostLoading } =
    api.posts.getPostById.useQuery({
      postId,
    });
  return (
    <>
      <Head>
        <title>single post </title>
        <meta name="post page" content="post page details" />
      </Head>
      <main className="flex h-screen justify-center">
        {isPostLoading && (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}
        {post && <PostsView post={post.post} auhtor={post.postUser} />}
      </main>
    </>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const postId = context.params?.id;
  if (typeof postId !== "string") throw new Error("invalid slug");
  await ssg.posts.getPostById.prefetch({
    postId,
  });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  };
};
export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export default PostPage;
