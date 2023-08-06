import * as React from "react";
import dayjs from "dayjs";
import { Big_Shoulders_Text } from "@next/font/google";

const bigShoulders = Big_Shoulders_Text({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
  display: "swap",
});

type Props = {
  month: number;
};

const text = [
  {
    text: "マウス乗せるとメニュー",
  },
  {
    text: "チェックマーク",
  },
  {
    text: "空きカラム",
  },
  {
    text: "土日祝は日付の色が",
  },
  {
    text: "日付選択ない時絵文字",
  },
];

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

const Items = (props: Props) => {
  const monthItem = [...(monthText[props.month - 1] ?? "")];

  return (
    <div className="flex w-52">
      <div>
        <div
          className={`text-4xl font-bold text-gray-300 ${bigShoulders.className}`}
        >
          {props.month}
        </div>
        <div className="month-title text-center text-gray-300">
          {monthItem.map((m) => (
            <div key={m}>{m}</div>
          ))}
        </div>
      </div>
      <div className="py-2 pl-3 text-xs font-bold text-gray-600">
        {text.map((t) => (
          <div key={t.text} className="border-b py-1 pr-2">
            <span className="pr-2">1</span>
            {t.text}
          </div>
        ))}
        <div className="flex items-center justify-center">
          <span>A</span>
          <input
            type="text"
            className="block w-full border-b border-gray-300 py-1 pl-2 outline-none focus:border-b-2 focus:border-blue-500"
            placeholder="タスクを入力"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Items);
