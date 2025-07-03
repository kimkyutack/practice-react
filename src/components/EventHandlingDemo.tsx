import React, { useState, useCallback } from "react";

interface EventHandlingDemoProps {
  title: string;
}

const EventHandlingDemo: React.FC<EventHandlingDemoProps> = ({ title }) => {
  const [text, setText] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // 1. 기본 이벤트 핸들러
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setText(event.target.value);
  };

  // 2. Select 이벤트 핸들러
  const handleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSelectedOption(event.target.value);
  };

  // 3. Checkbox 이벤트 핸들러
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsChecked(event.target.checked);
  };

  // 4. useCallback을 사용한 최적화된 이벤트 핸들러
  const handleButtonClick = useCallback((message: string) => {
    alert(`버튼 클릭: ${message}`);
  }, []);

  // 5. 마우스 이벤트 핸들러
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  // 6. 키보드 이벤트 핸들러
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      alert(`Enter 키 입력: ${text}`);
    }
  };

  // 7. 폼 제출 이벤트 핸들러
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault(); // 기본 동작 방지
    alert(`폼 제출: ${text} | ${selectedOption} | ${isChecked}`);
  };

  return (
    <div
      style={{
        border: "2px solid #007bff",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "500px",
      }}
    >
      <h3>{title}</h3>

      {/* 폼 요소들 */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>
            텍스트 입력:
            <input
              type="text"
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="텍스트를 입력하세요 (Enter 키로 확인)"
              style={{ marginLeft: "10px", padding: "5px" }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            선택 옵션:
            <select
              value={selectedOption}
              onChange={handleSelectChange}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              <option value="">선택하세요</option>
              <option value="option1">옵션 1</option>
              <option value="option2">옵션 2</option>
              <option value="option3">옵션 3</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              style={{ marginRight: "5px" }}
            />
            체크박스
          </label>
        </div>

        <button
          type="submit"
          style={{ marginRight: "10px", padding: "8px 16px" }}
        >
          폼 제출
        </button>
      </form>

      {/* 버튼들 */}
      <div style={{ marginTop: "15px" }}>
        <button
          onClick={() => handleButtonClick("첫 번째 버튼")}
          style={{ marginRight: "10px", padding: "8px 16px" }}
        >
          버튼 1
        </button>
        <button
          onClick={() => handleButtonClick("두 번째 버튼")}
          style={{ marginRight: "10px", padding: "8px 16px" }}
        >
          버튼 2
        </button>
      </div>

      {/* 마우스 위치 추적 */}
      <div
        onMouseMove={handleMouseMove}
        style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
          cursor: "crosshair",
        }}
      >
        <p>마우스를 이 영역에서 움직여보세요</p>
        <p>
          마우스 위치: X: {mousePosition.x}, Y: {mousePosition.y}
        </p>
      </div>

      {/* 현재 상태 표시 */}
      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#e9ecef",
        }}
      >
        <h4>현재 상태:</h4>
        <p>텍스트: {text || "(없음)"}</p>
        <p>선택된 옵션: {selectedOption || "(없음)"}</p>
        <p>체크박스: {isChecked ? "체크됨" : "체크 안됨"}</p>
      </div>
    </div>
  );
};

export default EventHandlingDemo;
