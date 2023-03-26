import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import { TRPCClientError } from "@trpc/client";
import { type NextPage } from "next";
import Head from "next/head";
import { type ChangeEvent, type FormEvent, useState, Suspense } from "react";
import { toast } from "react-hot-toast";
import { AddTweet } from "~/components/addTweet";
import Loader from "~/components/loader";
import { PostsView } from "~/components/Posts.component";
import { LoginUser } from "~/components/userLogin.component";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data } = api.posts.getAll.useQuery();
  const user = useUser();
  const ctx = api.useContext();
  const [tweet, setTweet] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTweet(e.target.value);
  };
  const { mutate, isLoading } = api.posts.create.useMutation({
    onSuccess: () => {
      setTweet("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const message = JSON.parse(err.message)[0].message;
        toast.error(message as string);
      }
    },
  });
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({
      content: tweet,
    });
  };
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col">
        <div className="w-full md:max-w-2xl">
          {user.isSignedIn ? <LoginUser user={user.user} /> : <SignInButton />}
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
        {user.isSignedIn && (
          <AddTweet
            imgSrc={user.user?.profileImageUrl ?? ""}
            val={tweet}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isDisabled={isLoading}
          />
        )}
        <Suspense fallback={<Loader />}>
          <div className="mt-8 flex flex-col px-4">
            {data ? (
              data.map((postDetails) => (
                <PostsView key={postDetails.post.id} {...postDetails} />
              ))
            ) : (
              <h2 className="text-center text-2xl text-slate-200">
                no tweets yet
              </h2>
            )}
          </div>
        </Suspense>
      </main>
    </>
  );
};

export default Home;
