import { useState, useEffect } from "react";

// 로컬 스토리지를 관리하는 커스텀 훅
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 로컬 스토리지에서 값을 가져오는 함수
  const getStoredValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // 상태 초기화
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // 로컬 스토리지에 값을 저장하는 함수
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수인 경우 이전 값을 받아서 새로운 값을 계산
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // 상태 업데이트
      setStoredValue(valueToStore);

      // 로컬 스토리지에 저장
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 로컬 스토리지에서 값을 제거하는 함수
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}
