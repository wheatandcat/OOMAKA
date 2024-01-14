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
    <div className="input-item items-center">
      <div className="relative block h-6">
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

        <input
          type="text"
          className="block w-full border-b border-gray-300 bg-white py-1 pl-7 outline-none sm:pl-5"
          placeholder=""
          defaultValue={props.value}
          disabled
          enterKeyHint="done"
        />
      </div>
    </div>
  );
};

export default memo(ShareItem);
