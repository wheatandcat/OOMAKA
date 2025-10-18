import React, { memo } from "react";
import type { DateValue } from "@mantine/dates";

type Props = {
  date?: DateValue;
  emoji?: string;
  value?: string;
  noEmoji?: boolean;
};

const ShareItem = (props: Props) => {
  return (
    <div className="share-item flex h-6 items-center justify-start border-b border-gray-300 sm:w-[155px]">
      <div className="w-6 rounded text-center sm:h-4 sm:w-4">
        {(() => {
          if (props.noEmoji) {
            return null;
          }

          if (props.emoji) {
            return props.emoji;
          }

          if (props.date) {
            return props.date.getDate();
          }
          return "🗓️";
        })()}
      </div>

      <div className=" bg-white pl-1">{props.value}</div>
    </div>
  );
};

export default memo(ShareItem);
