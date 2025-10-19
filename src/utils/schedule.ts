import type { Schedule } from "@prisma/client";
import dayjs from "~/utils/dayjs";

export const monthItems = (
  startMonth: number,
  startYear: number,
): dayjs.Dayjs[] => {
  const months: dayjs.Dayjs[] = [];
  for (let i = 0; i < 12; i++) {
    const currentMonth = ((startMonth - 1 + i) % 12) + 1;
    const currentYear = startYear + Math.floor((startMonth - 1 + i) / 12);

    const date = dayjs()
      .year(currentYear)
      .month(currentMonth - 1)
      .date(1);

    months.push(date);
  }

  return months;
};

export const getScheduleInMonth = (
  date: dayjs.Dayjs,
  schedule: Schedule[],
): Schedule[] => {
  return schedule.filter((s) => {
    return (
      s.date.getFullYear() === date.year() && s.date.getMonth() === date.month()
    );
  });
};
