import React, { useState, useCallback } from "react";
import { DatePicker, type DateValue } from "@mantine/dates";
import { Modal } from "@mantine/core";

type Props = {
  date?: DateValue;
  emoji?: string;
  value?: string;
  input?: boolean;
};

const InputItem = (props: Props) => {
  const [value, setValue] = useState(props.value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateValue>(null);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Enter");
    }
  }, []);

  return (
    <div className="input-item flex items-center">
      <div className="relative block h-6">
        <span
          className="absolute top-1/2 h-4 w-8 -translate-y-1/2 transform cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {(() => {
            if (date) {
              return date.getDate();
            } else {
              if (props.emoji) {
                return props.emoji;
              }
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
            />
          </div>
        </Modal>

        <input
          type="text"
          className="block w-full border-b border-gray-300 py-1 pl-7 outline-none focus:border-blue-500 sm:pl-5"
          placeholder="タスクを入力"
          defaultValue={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          maxLength={10}
        />
      </div>
    </div>
  );
};

export default React.memo(InputItem);
