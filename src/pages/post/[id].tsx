import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const PostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Head>
        <title>single post </title>
        <meta name="post page" content="post page details" />
      </Head>
      <main className="flex h-screen justify-center">
        <h1>post page {id}</h1>
      </main>
    </>
  );
};
export default PostPage;
