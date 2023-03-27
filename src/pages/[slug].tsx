import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <>
      <Head>
        <title>{slug}</title>
        <meta name="post page" content="post page details" />
      </Head>
      <main className="flex h-screen justify-center">
        <h1>user profile {slug}</h1>
      </main>
    </>
  );
};
export default ProfilePage;
