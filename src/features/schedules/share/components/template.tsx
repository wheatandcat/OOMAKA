"use client";

import { useState, useCallback } from "react";
import Period from "~/features/schedules/components/Period";
import Items from "~/features/schedules/components/Items";
import dayjs from "~/utils/dayjs";
import { monthItems, getScheduleInMonth } from "~/utils/schedule";
import Pagination from "~/features/schedules/components/Pagination";
import { toast } from "react-toastify";
import Layout from "~/components/Layout/Layout";
import { type Schedule } from "@prisma/client";

type Props = {
  id: string;
  schedules: Schedule[];
};

export function Template(props: Props) {
  const [startDate, setStartDate] = useState(dayjs());

  const months = monthItems(
    Number(startDate.format("M")),
    Number(startDate.year()),
  );

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

  return (
    <Layout>
      <main className="container mx-auto max-w-screen-xl gap-12 pt-3">
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
            <div key={index} className="px-0 pb-6 sm:pb-16 sm:pr-16">
              <Items
                share
                urlId={String(props.id)}
                date={item}
                defaultItems={getScheduleInMonth(item, props.schedules ?? [])}
              />
            </div>
          ))}
        </div>
        <div className="mb-10 flex justify-center">
          <button
            type="button"
            className="mb-1 mr-1 rounded-md border border-gray-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-500 dark:text-gray-500 dark:hover:bg-gray-500 dark:hover:text-white dark:focus:ring-gray-800"
            onClick={() => void onShare()}
          >
            リンクをコピー
          </button>
        </div>
      </main>
    </Layout>
  );
}
