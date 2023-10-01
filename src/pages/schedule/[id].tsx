import Head from "next/head";
import { signIn, signOut } from "next-auth/react";
import { useEffect, useCallback, memo } from "react";
import { useRouter } from "next/router";
import Period from "~/features/schedules/components/Period";
import Items from "~/features/schedules/components/Items";
import { api } from "~/utils/api";
import dayjs from "~/utils/dayjs";
import { monthItems, getScheduleInMonth } from "~/utils/schedule";
import useLocalStorage from "~/hooks/useLocalStorage";

const sessionData = true;

function Schedule() {
  const router = useRouter();
  const { id } = router.query;
  const { setValueAndStorage } = useLocalStorage("URL_ID");
  const url = api.url.exists.useQuery({ id: String(id) });

  useEffect(() => {
    if (url.data === false) {
      // 存在しないURLの場合はトップページに戻す
      void router.push(`/`);
    }
  }, [url.data, router]);

  const schedules = api.schedule.fetch.useQuery({ urlId: String(id) });
  const months = monthItems(
    Number(dayjs().format("M")),
    Number(dayjs().year())
  );

  const onLogout = useCallback(async () => {
    await signOut();
    setValueAndStorage("");
    void router.push(`/`);
  }, [router, setValueAndStorage]);

  return (
    <>
      <Head>
        <title>OMAKA | 年間スケジュール、まとめるなら</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute top-0 hidden pr-36 sm:block  md:right-48 lg:right-96">
        <div className="flex w-14  cursor-pointer flex-col items-center pt-3 text-xl hover:bg-blue-100">
          🔗
          <div className="text-xxs text-center text-gray-500">シェア</div>
        </div>
      </div>
      <div className="absolute top-0 hidden pr-24 sm:block  md:right-48 lg:right-96">
        <div className="flex w-14 cursor-pointer flex-col items-center pt-3 text-xl hover:bg-blue-100">
          🖨️
          <div className="text-xxs text-center text-gray-500">印刷</div>
        </div>
      </div>
      <div
        className="absolute top-0 hidden pr-10 sm:block  md:right-48 lg:right-96"
        onClick={() => {
          if (sessionData) {
            void onLogout();
          } else {
            void signIn();
          }
        }}
      >
        <div className="flex w-14 cursor-pointer flex-col items-center pt-3 text-xl hover:bg-blue-100">
          {sessionData ? "🔓" : "🗝️"}
          <div className="text-xxs text-center text-gray-500">
            {sessionData ? "ログアウト" : "ログイン"}
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-screen-xl gap-12 px-4 pt-3">
        <div className="relative flex justify-between">
          <Period
            startDate={dayjs().format()}
            endDate={dayjs().add(1, "years").format()}
          />
        </div>
        <div className="flex flex-col flex-nowrap justify-center pt-10 sm:flex-row sm:flex-wrap sm:justify-start">
          {schedules.isLoading ? (
            <div className="flex h-screen w-screen items-center justify-center">
              loading...
            </div>
          ) : (
            months.map((item, index) => (
              <div key={index} className="px-8 pb-8 sm:pb-16">
                <Items
                  urlId={String(id)}
                  date={item}
                  defaultItems={getScheduleInMonth(item, schedules.data ?? [])}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}

export default memo(Schedule);
