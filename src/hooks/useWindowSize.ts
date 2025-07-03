import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

// 윈도우 크기를 추적하는 커스텀 훅
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // 윈도우 크기 변경 핸들러
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 정리 함수
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  return windowSize;
}
