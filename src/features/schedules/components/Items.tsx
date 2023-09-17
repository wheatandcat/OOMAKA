import * as React from "react";
import { Big_Shoulders_Text } from "@next/font/google";
import { emoji } from "~/lib/emoji";
import { DatePickerInput } from "@mantine/dates";
import { Modal } from "@mantine/core";
import InputItem from "./InputItem";

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
    emoji: "🎍",
    text: "マウス乗せるとメニュー",
  },
  {
    emoji: "⛩️",
    text: "チェックマーク",
  },
  {
    emoji: "🎌",
    text: "空きカラム",
  },
  {
    emoji: "🌅",
    text: "土日祝は日付の色が",
  },
  {
    emoji: "🍱",
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
    <div className="flex px-10 sm:w-fit sm:px-0">
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
      <div className="py-2 pl-3 text-base font-bold text-gray-600 sm:text-xs">
        {text.map((t, index) => (
          <InputItem key={index} emoji={t.emoji} value={t.text} />
        ))}
        <InputItem input />
      </div>
    </div>
  );
};

export default React.memo(Items);
