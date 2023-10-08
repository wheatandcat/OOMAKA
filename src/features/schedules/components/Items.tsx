import React, { useState, useCallback, useEffect } from "react";
import { Big_Shoulders_Text } from "@next/font/google";
import { type Schedule } from "@prisma/client";
import type dayjs from "~/utils/dayjs";
import { api } from "~/utils/api";
import InputItem from "./InputItem";
import usePrevious from "~/hooks/usePrevious";

const bigShoulders = Big_Shoulders_Text({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  urlId: string;
  date: dayjs.Dayjs;
  defaultItems: Schedule[];
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

  const schedules = api.schedule.fetchInPeriod.useQuery({
    urlId: props.urlId,
    startDate: props.date.toDate(),
    endDate: props.date.endOf("month").toDate(),
  });

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
      if (prevDate.isSame(props.date, "month")) {
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
        {items.map((t) => (
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
        ))}
        <InputItem
          input
          urlId={props.urlId}
          minDate={props.date}
          maxDate={props.date.endOf("month")}
          onRefresh={() => {
            onRefresh().catch((error) => {
              console.error(error);
            });
          }}
        />
        {(() => {
          if (items.length <= 4) {
            const myArray = createArray(4 - items.length);
            return myArray.map((_, index) => (
              <div className="input-item border-b border-gray-300" key={index}>
                <div className="relative block h-6" />
              </div>
            ));
          }
          return null;
        })()}
      </div>
    </div>
  );
};

export default React.memo(Items);
