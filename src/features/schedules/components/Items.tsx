import React, { memo, useState, useCallback, useEffect } from "react";

import { Big_Shoulders_Text } from "next/font/google";
import { type Schedule } from "@prisma/client";
import type dayjs from "~/utils/dayjs";
import { api } from "~/utils/api";
import usePrevious from "~/hooks/usePrevious";
import InputItem from "./InputItem";
import ShareItem from "./ShareItem";

const MAX_ITEMS = 5;

const bigShoulders = Big_Shoulders_Text({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  urlId: string;
  date: dayjs.Dayjs;
  defaultItems: Schedule[];
  share?: boolean;
};

const monthText = [
  "JUN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const createArray = (length: number): number[] => {
  return Array.from({ length }, (_, i) => i);
};

const Items = (props: Props) => {
  const [items, setItems] = useState(props.defaultItems ?? []);
  const prevDate = usePrevious<dayjs.Dayjs>(props.date);

  const schedules = api.schedule.fetchInPeriod.useQuery(
    {
      urlId: props.urlId,
      startDate: props.date.startOf("day").toDate(),
      endDate: props.date.endOf("month").toDate(),
    },
    {
      trpc: {
        ssr: false,
      },
      enabled: false, // 初回はfetchしない
    },
  );

  const month = Number(props.date.format("M"));
  const monthItem = [...(monthText[month - 1] ?? "")];

  const onRefresh = useCallback(async () => {
    const r = await schedules.refetch();
    if (r.error) {
      return;
    }

    setItems(r.data ?? []);
  }, [schedules]);

  useEffect(() => {
    if (prevDate) {
      if (!prevDate.isSame(props.date, "month")) {
        setItems(props.defaultItems ?? []);
      }
    }
  }, [prevDate, props.date, props.defaultItems]);

  return (
    <div className="flex px-8 sm:w-fit sm:px-0">
      <div>
        <div
          className={`w-6 text-center text-4xl font-bold text-gray-300 ${bigShoulders.className}`}
        >
          {month}
        </div>
        <div className="month-title text-center text-gray-300">
          {monthItem.map((m) => (
            <div key={m}>{m}</div>
          ))}
        </div>
      </div>
      <div className="w-4/5 py-2 pl-3 text-base font-bold text-gray-600 sm:w-fit sm:text-xs">
        {items.map((t) => {
          if (props.share) {
            return (
              <ShareItem
                key={t.id}
                date={t.date}
                emoji={t.emoji ?? ""}
                value={t.text}
              />
            );
          }

          return (
            <InputItem
              key={t.id}
              urlId={props.urlId}
              id={t.id}
              emoji={t.emoji ?? ""}
              date={t.date}
              value={t.text}
              minDate={props.date}
              maxDate={props.date.endOf("month")}
              onRefresh={() => {
                onRefresh().catch((error) => {
                  console.error(error);
                });
              }}
            />
          );
        })}

        {(() => {
          if (items.length < MAX_ITEMS) {
            if (props.share) {
              return <ShareItem noEmoji />;
            } else {
              return (
                <InputItem
                  urlId={props.urlId}
                  minDate={props.date}
                  maxDate={props.date.endOf("month")}
                  onRefresh={() => {
                    onRefresh().catch((error) => {
                      console.error(error);
                    });
                  }}
                />
              );
            }
          }
          return null;
        })()}

        {(() => {
          if (items.length <= MAX_ITEMS - 1) {
            const itemClass = "input-item";
            const myArray = createArray(MAX_ITEMS - 1 - items.length);
            return myArray.map((_, index) => {
              const firstClass =
                index === 0 && !props.share ? "input-item-first" : "";
              return (
                <div
                  className={`${itemClass} ${firstClass} border-b border-gray-300`}
                  key={index}
                />
              );
            });
          }
          return null;
        })()}
      </div>
    </div>
  );
};

export default memo(Items);
