import React, { memo, useState, useCallback } from "react";
import { DatePicker, type DateValue } from "@mantine/dates";
import { Modal } from "@mantine/core";
import { api } from "~/utils/api";
import dayjs from "~/utils/dayjs";
import { emojiList } from "~/utils/emoji";

type Props = {
  id?: string;
  date?: DateValue;
  emoji?: string;
  value?: string;
  input?: boolean;
  maxDate: dayjs.Dayjs;
  minDate: dayjs.Dayjs;
  onRefresh: () => void;
};

const InputItem = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(props.value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateValue | null>(props.date ?? null);
  const createMutation = api.schedule.create.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      setLoading(false);
      props.onRefresh();
    },
  });

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        let emoji = "";

        if (date) {
          emoji = "";
        } else {
          if (!props.emoji) {
            const month = Number(dayjs().format("M")) - 1;
            console.log(month);
            const items = emojiList[month] ?? [];
            const index = Math.floor(Math.random() * items.length);
            emoji = items[index] ?? "";
          } else {
            emoji = props.emoji ?? "";
          }
        }

        if (value) {
          const variables = {
            urlId: "aaaa",
            day: date ? date.getDate() : 99,
            date: date ? date : dayjs(props.maxDate).toDate(),
            emoji,
            text: value,
          };
          createMutation.mutate(variables);
          e.currentTarget.value = "";
          setValue("");
          setLoading(true);
        }
      }
    },
    [createMutation, date, props.emoji, props.maxDate, value]
  );

  return (
    <div className="input-item flex items-center">
      <div className="relative block h-6">
        <span
          className="absolute top-1/2 h-4 w-8 -translate-y-1/2 transform cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {(() => {
            if (props.emoji) {
              return props.emoji;
            }

            if (date) {
              return date.getDate();
            } else {
              return "🗓️";
            }
          })()}
        </span>
        <Modal opened={isOpen} onClose={() => setIsOpen(false)}>
          <div className="mb-5 flex items-center justify-center">
            <DatePicker
              value={date}
              onChange={(value) => {
                setDate(value);
                setIsOpen(false);
              }}
              defaultDate={props.minDate.toDate()}
              minDate={props.minDate.toDate()}
              maxDate={props.maxDate.toDate()}
            />
          </div>
        </Modal>

        <input
          type="text"
          className="block w-full border-b border-gray-300 py-1 pl-7 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:text-gray-300 sm:pl-5"
          placeholder="タスクを入力"
          defaultValue={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          maxLength={10}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default memo(InputItem);
