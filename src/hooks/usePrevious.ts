import { useEffect, useRef } from "react";
import type { RefObject } from "react";

function usePrevious<T>(value: T): RefObject<T | undefined>["current"] {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;
