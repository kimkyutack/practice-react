import React, { useState } from "react";

// TypeScript 인터페이스 정의
interface CounterProps {
  initialValue?: number;
  title?: string;
}

// 함수형 컴포넌트 정의
const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  title = "카운터",
}) => {
  // useState 훅 사용 (TypeScript가 자동으로 타입을 추론)
  const [count, setCount] = useState<number>(initialValue);

  // 이벤트 핸들러 함수들
  const increment = (): void => {
    setCount(count + 1);
  };

  const decrement = (): void => {
    setCount(count - 1);
  };

  const reset = (): void => {
    setCount(initialValue);
  };

  return (
    <div
      style={{
        border: "2px solid #ccc",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "2em", fontWeight: "bold" }}>{count}</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={decrement} style={{ padding: "8px 16px" }}>
          -
        </button>
        <button onClick={reset} style={{ padding: "8px 16px" }}>
          리셋
        </button>
        <button onClick={increment} style={{ padding: "8px 16px" }}>
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
