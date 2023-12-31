"use client";

import { signIn, signOut } from "next-auth/react";
import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Period from "~/features/schedules/components/Period";
import Items from "~/features/schedules/components/Items";
import dayjs from "~/utils/dayjs";
import { monthItems, getScheduleInMonth } from "~/utils/schedule";
import Pagination from "~/features/schedules/components/Pagination";
import { toast } from "react-toastify";
import Layout from "~/components/Layout/Layout";
import { type Schedule } from "@prisma/client";

type Props = {
  login: boolean;
  id: string;
  schedules: Schedule[];
};

export function Template(props: Props) {
const router = useRouter();

  const [startDate, setStartDate] = useState(dayjs());
  const [print, setPrint] = useState(false);

  const months = monthItems(
    Number(startDate.format("M")),
    Number(startDate.year()),
  );

  const onLogout = useCallback(async () => {
    window.localStorage.setItem("URL_ID", "");
    await signOut({
      callbackUrl: "/",
    });
  }, []);

  const onToIndex = useCallback(() => {
    window.localStorage.setItem("URL_ID", "");
    router.push("/");
  }, [router]);

  const onShare = useCallback(async () => {
    await global.navigator.clipboard.writeText(`${window.location.href}/share`);
    toast.success("URLをコピーしました！", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }, []);

  const onPrint = useCallback(() => {
    setPrint(true);
    setTimeout(() => window.print(), 100);
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrint(false);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  return (
    <Layout>
      <>
        <main className="screen-container container mx-auto max-w-screen-xl gap-12 pt-3">
          <div className="no-print">
            <div className="absolute right-28 top-0 hidden sm:block">
              <div
                className="flex w-14 cursor-pointer flex-col items-center pt-3 text-xl hover:bg-blue-100"
                onClick={() => void onShare()}
              >
                🔗
                <div className="text-xxs text-center text-gray-500">シェア</div>
              </div>
            </div>
            <div
              className="absolute right-14 top-0 hidden sm:block"
              onClick={() => void onPrint()}
            >
              <div className="flex w-14 cursor-pointer flex-col items-center pt-3 text-xl hover:bg-blue-100">
                🖨️
                <div className="text-xxs text-center text-gray-500">印刷</div>
              </div>
            </div>
            <div
              className="absolute right-0 top-0 hidden sm:block"
              onClick={() => {
                if (props.login) {
                  void onLogout();
                } else {
                  void signIn("credentials", {
                    callbackUrl: "/",
                  });
                }
              }}
            >
              <div className="flex w-14 cursor-pointer flex-col items-center pt-3 text-xl hover:bg-blue-100">
                {props.login ? "🔓" : "🗝️"}
                <div className="text-xxs text-center text-gray-500">
                  {props.login ? "ログアウト" : "ログイン"}
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden justify-between sm:flex">
            <Period
              startDate={startDate.format()}
              endDate={startDate.add(1, "years").format()}
            />
            <Pagination
              onNext={() => setStartDate(startDate.add(1, "months"))}
              onPrev={() => setStartDate(startDate.subtract(1, "months"))}
            />
          </div>
          <div className="flex flex-col flex-nowrap justify-center pt-10 sm:flex-row sm:flex-wrap sm:justify-start">
            {months.map((item, index) => (
              <div
                key={index}
                className="item-container px-0 pb-6 sm:pb-16 sm:pr-16"
              >
                <Items
                  urlId={props.id}
                  date={item}
                  defaultItems={getScheduleInMonth(item, props.schedules ?? [])}
                  share={print}
                />
              </div>
            ))}
          </div>
          <div className="no-print mb-10 flex justify-center">
            {props.login ? (
              <button
                type="button"
                className="mb-1 mr-1 rounded-md border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:ring-red-800"
                onClick={() => void onLogout()}
              >
                ログアウト
              </button>
            ) : (
              <button
                type="button"
                className="mb-1 mr-1 rounded-md border border-gray-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-500 dark:text-gray-500 dark:hover:bg-gray-500 dark:hover:text-white dark:focus:ring-gray-800"
                onClick={() => void onToIndex()}
              >
                トップページに戻る
              </button>
            )}
          </div>
        </main>
      </>
    </Layout>
  );
}
