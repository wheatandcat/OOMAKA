import React, { memo, useState, useCallback } from "react";
import { DatePicker, type DateValue } from "@mantine/dates";
import { Modal } from "@mantine/core";
import { api } from "~/utils/api";
import dayjs from "~/utils/dayjs";
import { emojiList } from "~/utils/emoji";

type Props = {
  urlId: string;
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
  const [isComposing, setIsComposing] = useState(false);
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
  const deleteMutation = api.schedule.delete.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      props.onRefresh();
    },
  });
  const updateMutation = api.schedule.update.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      props.onRefresh();
    },
  });

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isComposing) {
        let emoji = "";

        if (date) {
          emoji = props.emoji ?? "";
        } else {
          if (!props.emoji) {
            const month = Number(dayjs().format("M")) - 1;
            const items = emojiList[month] ?? [];
            const index = Math.floor(Math.random() * items.length);
            emoji = items[index] ?? "";
          } else {
            emoji = props.emoji ?? "";
          }
        }

        if (value) {
          if (props.id) {
            const variables = {
              id: props.id ?? "",
              urlId: props.urlId,
              day: date ? date.getDate() : 99,
              date: date ? date : dayjs(props.maxDate).toDate(),
              emoji,
              text: value,
            };
            updateMutation.mutate(variables);
          } else {
            const variables = {
              urlId: props.urlId,
              day: date ? date.getDate() : 99,
              date: date ? date : dayjs(props.maxDate).toDate(),
              emoji,
              text: value,
            };

            createMutation.mutate(variables);
            e.currentTarget.value = "";
            setValue("");
            setDate(null);
            setLoading(true);
          }
        } else {
          // valueが空の場合は削除
          if (props.id) {
            const variables = {
              id: props.id ?? "",
            };
            deleteMutation.mutate(variables);
          }
        }
      }
    },
    [
      isComposing,
      date,
      value,
      props.emoji,
      props.maxDate,
      props.id,
      props.urlId,
      createMutation,
      updateMutation,
      deleteMutation,
    ]
  );

  const onRemoveDate = useCallback(() => {
    if (props.id) {
      const variables = {
        id: props.id ?? "",
        urlId: props.urlId,
        day: date ? date.getDate() : 99,
        date: date ? date : dayjs(props.maxDate).toDate(),
        emoji,
        text: value,
      };
      updateMutation.mutate(variables);
    }

    setDate(null);
    setIsOpen(false);
  }, []);

  return (
    <div className="input-item flex items-center">
      <div className="relative block h-6">
        <span
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer rounded text-center hover:bg-blue-100"
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
          <div className="mb-5 flex flex-col items-center justify-center">
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
            <br />
            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={onRemoveDate}
            >
              日付を解除
            </button>
          </div>
        </Modal>

        <input
          type="text"
          className="block w-full border-b border-gray-300 py-1 pl-7 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:text-gray-300 sm:pl-5"
          placeholder="タスクを入力"
          defaultValue={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={onKeyDown}
          maxLength={10}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default memo(InputItem);
