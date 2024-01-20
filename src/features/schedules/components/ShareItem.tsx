import React, { memo } from "react";
import { type DateValue } from "@mantine/dates";

type Props = {
  date?: DateValue;
  emoji?: string;
  value?: string;
  noEmoji?: boolean;
};

const ShareItem = (props: Props) => {
  return (
    <div className="input-item flex h-6 w-[155px] items-center justify-start border-b border-gray-300">
      <div className="h-4 w-4 rounded text-center">
        {(() => {
          if (props.noEmoji) {
            return null;
          }

          if (props.emoji) {
            return props.emoji;
          }

          if (props.date) {
            return props.date.getDate();
          } else {
            return "🗓️";
          }
        })()}
      </div>

      <div className=" bg-white pl-1">{props.value}</div>
    </div>
  );
};

export default memo(ShareItem);
