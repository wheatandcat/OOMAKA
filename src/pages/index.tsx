import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import useLocalStorage from "~/hooks/useLocalStorage";
import { useEffect, useCallback, memo } from "react";

let login = false;

function Home() {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { value, setValueAndStorage } = useLocalStorage("URL_ID");
  const url = api.url.existsByUserId.useQuery({
    userId: String(sessionData?.user?.id),
  });

  useEffect(() => {
    if (value && value !== "") {
      void router.push(`/schedule/${value}`);
    }
  }, [value, router]);

  const createMutation = api.url.create.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async (data) => {
      setValueAndStorage(data.id);
      await router.push(`/schedule/${data.id}`);
    },
  });

  const onLogIn = useCallback(async () => {
    const res = await url.refetch();
    if (res.data) {
      setValueAndStorage(res.data.id);
      await router.push(`/schedule/${res.data.id}`);
    } else {
      createMutation.mutate({ userId: String(sessionData?.user?.id) });
    }
  }, [createMutation, router, sessionData?.user?.id, setValueAndStorage, url]);

  useEffect(() => {
    if (sessionData && !login) {
      login = true;
      void onLogIn();
    }
  }, [onLogIn, sessionData, setValueAndStorage, url]);

  const onCreateURL = useCallback(() => {
    createMutation.mutate({ userId: "" });
  }, [createMutation]);

  return (
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
                className="w-72 rounded-full bg-green-500 px-10 py-3 font-semibold  text-white no-underline transition hover:bg-green-300"
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
  );
}

export default memo(Home);
