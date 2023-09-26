import { useEffect, useState } from "react";

const useLocalStorage = (key: string) => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const res: string | null = window.localStorage.getItem(key);
    if (!res) {
      setValue("local storage is empty");
    }
    setValue(res ?? "");
  }, [key]);

  const setValueAndStorage = (newValue: string) => {
    window.localStorage.setItem(key, newValue);
    setValue(newValue);
  };

  return { value, setValueAndStorage };
};

export default useLocalStorage;
