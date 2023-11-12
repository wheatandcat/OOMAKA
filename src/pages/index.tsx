import { type GetServerSideProps } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { getServerAuthSession } from "../server/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useEffect, useCallback, memo } from "react";
import Layout from "~/components/Layout/Layout";

let login = false;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

function Home() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const url = api.url.existsByUserId.useQuery(
    {
      userId: String(sessionData?.user?.id),
    },
    {
      enabled: !!sessionData?.user?.id,
    }
  );

  useEffect(() => {
    const check = async () => {
      const res: string | null = window.localStorage.getItem("URL_ID");
      if (res) {
        await router.push(`/schedule/${res}`);
      }
    };

    void check();
  }, [router]);

  const createMutation = api.url.create.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async (data) => {
      window.localStorage.setItem("URL_ID", data.id);
      await router.push(`/schedule/${data.id}`);
    },
  });

  const onLogIn = useCallback(async () => {
    const res = await url.refetch();
    if (res.data) {
      window.localStorage.setItem("URL_ID", res.data.id);
      await router.push(`/schedule/${res.data.id}`);
    } else {
      createMutation.mutate({ userId: String(sessionData?.user?.id) });
    }
  }, [createMutation, router, sessionData?.user?.id, url]);

  useEffect(() => {
    if (sessionData && !login) {
      login = true;
      void onLogIn();
    }
  }, [onLogIn, sessionData]);

  const onCreateURL = useCallback(() => {
    createMutation.mutate({ userId: "" });
  }, [createMutation]);

  console.log("sessionData:", sessionData);

  return (
    <Layout>
      <>
        <Head>
          <title>OOMAKA | 年間スケジュール、まとめるなら</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[3rem]">
              年間スケジュール、まとめよう !
            </h1>

            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center justify-center gap-4">
                <br />
                <button
                  className="w-72 rounded-full bg-green-500 px-10 py-4 font-semibold  text-white no-underline transition hover:bg-green-300"
                  onClick={onCreateURL}
                >
                  新しいカレンダーを作る
                </button>
                <br />
                {!sessionData && (
                  <button
                    className="my-3 w-72 rounded-full bg-blue-500 px-10 py-3  font-semibold text-white no-underline transition hover:bg-blue-300"
                    onClick={() => void signIn()}
                  >
                    ログイン
                  </button>
                )}
                {sessionData && (
                  <button
                    className="w-72 rounded-full bg-red-500 px-10 py-3  font-semibold text-white no-underline transition hover:bg-red-300"
                    onClick={() => void signOut()}
                  >
                    ログアウト
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </>
    </Layout>
  );
}

export default memo(Home);
