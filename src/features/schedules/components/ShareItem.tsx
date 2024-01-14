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
    <div className="b-1 flex h-[32px] items-center border-b border-gray-300 pb-3 sm:h-[32px] sm:pb-0">
      <div className="relative block">
        <span className="absolute top-1/2 h-4 w-4 -translate-y-1/2 transform rounded text-center">
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
        </span>

        <div className="h-[19px] w-[167px] bg-white py-[3px] pl-7 outline-none sm:h-[19px] sm:py-[2px] sm:pl-5">
          {props.value}
        </div>
      </div>
    </div>
  );
};

export default memo(ShareItem);
