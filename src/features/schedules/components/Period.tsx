import React, { memo } from "react";
import { JpZodiac } from "~/utils/emoji";
import dayjs from "dayjs";

type Props = {
  startDate: string;
  endDate: string;
};

const Period = (props: Props) => (
  <div className="text-xl font-bold">
    {dayjs(props.startDate).year()}/
    {
      new Intl.DateTimeFormat("ja-JP-u-ca-japanese", { era: "long" })
        .format(new Date(props.startDate))
        .split("/")[0]
    }
    年{JpZodiac[(dayjs(props.startDate).year() + 8) % 12]} 〜{" "}
    {dayjs(props.endDate).year()}/{" "}
    {
      new Intl.DateTimeFormat("ja-JP-u-ca-japanese", { era: "long" })
        .format(new Date(props.endDate))
        .split("/")[0]
    }
    年{JpZodiac[(dayjs(props.endDate).year() + 8) % 12]}
  </div>
);

export default memo(Period);
