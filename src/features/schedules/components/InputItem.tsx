import { Modal } from "@mantine/core";
import { DatePicker, type DateValue } from "@mantine/dates";
import { memo, useCallback, useState } from "react";
import { api } from "~/trpc/react";
import dayjs from "~/utils/dayjs";
import { getEmoji } from "~/utils/emoji";

type Props = {
  urlId: string;
  id?: string;
  date?: DateValue;
  emoji?: string;
  value?: string;
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

  const save = useCallback(() => {
    let emoji = "";

    if (date) {
      emoji = props.emoji ?? "";
    } else {
      if (!props.emoji) {
        emoji = getEmoji(props.minDate);
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
        return "update";
      }
      const variables = {
        urlId: props.urlId,
        day: date ? date.getDate() : 99,
        date: date ? date : dayjs(props.maxDate).toDate(),
        emoji,
        text: value,
      };

      createMutation.mutate(variables);

      setValue("");
      setDate(null);
      setLoading(true);
      return "new";
    }

    // valueが空の場合は削除
    if (props.id) {
      const variables = {
        id: props.id ?? "",
      };
      deleteMutation.mutate(variables);
      return "delete";
    }
  }, [
    date,
    value,
    props.emoji,
    props.minDate,
    props.id,
    props.urlId,
    props.maxDate,
    updateMutation,
    createMutation,
    deleteMutation,
  ]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isComposing) {
        if (save() === "new") {
          e.currentTarget.value = "";
        }
      }
    },
    [isComposing, save]
  );

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (value) {
        if (save() === "new") {
          e.currentTarget.value = "";
        }
      }
    },
    [value, save]
  );

  const onRemoveDate = useCallback(() => {
    if (props.id) {
      const variables = {
        id: props.id ?? "",
        urlId: props.urlId,
        day: 99,
        date: dayjs(props.maxDate).toDate(),
        emoji: getEmoji(props.minDate),
        text: value,
      };
      updateMutation.mutate(variables);
    }

    setDate(null);
    setIsOpen(false);
  }, [
    value,
    props.id,
    props.urlId,
    props.minDate,
    props.maxDate,
    updateMutation,
  ]);

  const onChangeDate = useCallback(
    (tDate: DateValue) => {
      if (props.id) {
        const variables = {
          id: props.id ?? "",
          urlId: props.urlId,
          day: tDate?.getDate?.() ?? 99,
          date: tDate ?? dayjs(props.maxDate).toDate(),
          emoji: "",
          text: value,
        };
        updateMutation.mutate(variables);
        setDate(tDate);
        setIsOpen(false);
      } else if (value) {
        const variables = {
          urlId: props.urlId,
          day: tDate?.getDate?.() ?? 99,
          date: tDate ?? dayjs(props.maxDate).toDate(),
          emoji: "",
          text: value,
        };
        createMutation.mutate(variables);
        setValue("");
        setDate(null);
        setLoading(true);
        setIsOpen(false);
      } else {
        setDate(tDate);
        setIsOpen(false);
      }
    },
    [
      props.id,
      props.urlId,
      props.maxDate,
      value,
      updateMutation,
      createMutation,
    ]
  );

  return (
    <div className="input-item items-center">
      <div className="relative block h-6">
        <span
          className="-translate-y-1/2 absolute top-1/2 h-4 w-4 transform cursor-pointer rounded text-center sm:hover:bg-blue-100"
          onClick={() => setIsOpen(true)}
        >
          {(() => {
            if (props.emoji) {
              return props.emoji;
            }

            if (date) {
              return date.getDate();
            }
            return "🗓️";
          })()}
        </span>
        <Modal opened={isOpen} onClose={() => setIsOpen(false)}>
          <div className="mb-5 flex flex-col items-center justify-center">
            <DatePicker
              value={date}
              onChange={onChangeDate}
              defaultDate={props.minDate.toDate()}
              minDate={props.minDate.toDate()}
              maxDate={props.maxDate.toDate()}
              locale="ja"
              monthLabelFormat="YYYY年M月"
            />
            <br />
            <button
              type="button"
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={onRemoveDate}
            >
              日付を解除
            </button>
          </div>
        </Modal>

        <input
          type="text"
          className="block w-full border-gray-300 border-b py-1 pl-7 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:text-gray-300 sm:pl-5"
          placeholder="タスクを入力"
          value={value}
          onChange={(e) => {
            setValue(e.currentTarget.value);
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          maxLength={10}
          disabled={loading}
          enterKeyHint="done"
        />
      </div>
    </div>
  );
};

export default memo(InputItem);
