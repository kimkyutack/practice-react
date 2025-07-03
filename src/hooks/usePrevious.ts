import { useRef, useEffect } from "react";

// 이전 값을 추적하는 커스텀 훅
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
