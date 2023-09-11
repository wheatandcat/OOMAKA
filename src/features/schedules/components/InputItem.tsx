import React, { useState } from "react";
import { DatePicker, type DateValue } from "@mantine/dates";
import { Modal } from "@mantine/core";

const InputItem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateValue>(null);

  return (
    <div className="flex items-center">
      <div className="relative block h-8">
        <span
          className="absolute top-1/2 h-6 w-8 -translate-y-1/2 transform cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {date ? date.getDate() : "🗓️"}
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
          className="focus:border-b-1 block w-full border-b border-gray-300 py-1 pl-7 outline-none focus:border-blue-500 sm:pl-5"
          placeholder="タスクを入力"
        />
      </div>
    </div>
  );
};

export default React.memo(InputItem);
