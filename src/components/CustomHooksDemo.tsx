import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useDebounce } from "../hooks/useDebounce";
import { useWindowSize } from "../hooks/useWindowSize";
import { useToggle } from "../hooks/useToggle";
import { usePrevious } from "../hooks/usePrevious";

interface CustomHooksDemoProps {
  title: string;
}

const CustomHooksDemo: React.FC<CustomHooksDemoProps> = ({ title }) => {
  // 1. useLocalStorage 훅 사용
  const [savedText, setSavedText, removeSavedText] = useLocalStorage<string>(
    "demo-text",
    ""
  );
  const [savedCount, setSavedCount] = useLocalStorage<number>("demo-count", 0);

  // 2. useDebounce 훅 사용
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 3. useWindowSize 훅 사용
  const windowSize = useWindowSize();

  // 4. useToggle 훅 사용
  const [isVisible, { toggle: toggleVisibility }] = useToggle(false);
  const [
    isEnabled,
    { toggle: toggleEnabled, setTrue: enable, setFalse: disable },
  ] = useToggle(true);

  // 5. usePrevious 훅 사용
  const [currentValue, setCurrentValue] = useState<number>(0);
  const previousValue = usePrevious(currentValue);

  return (
    <div
      style={{
        border: "2px solid #e83e8c",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "700px",
      }}
    >
      <h3>{title}</h3>

      {/* 1. useLocalStorage 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>💾 useLocalStorage 훅</h4>
        <p>브라우저를 새로고침해도 값이 유지됩니다!</p>

        <div style={{ marginBottom: "10px" }}>
          <label>저장할 텍스트:</label>
          <input
            type="text"
            value={savedText}
            onChange={(e) => setSavedText(e.target.value)}
            placeholder="텍스트를 입력하세요"
            style={{ marginLeft: "10px", padding: "5px" }}
          />
          <button
            onClick={() => removeSavedText()}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            삭제
          </button>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>카운터:</label>
          <button
            onClick={() => setSavedCount((prev) => prev + 1)}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            증가 ({savedCount})
          </button>
          <button
            onClick={() => setSavedCount(0)}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            리셋
          </button>
        </div>
      </div>

      {/* 2. useDebounce 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>⏱️ useDebounce 훅</h4>
        <p>입력 후 500ms 후에 검색어가 업데이트됩니다.</p>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력하세요..."
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <strong>실시간 입력:</strong> {searchTerm || "(없음)"}
          </div>
          <div>
            <strong>디바운스된 값:</strong> {debouncedSearchTerm || "(없음)"}
          </div>
        </div>
      </div>

      {/* 3. useWindowSize 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>📐 useWindowSize 훅</h4>
        <p>브라우저 창의 크기를 조절해보세요!</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <strong>너비:</strong> {windowSize.width}px
          </div>
          <div>
            <strong>높이:</strong> {windowSize.height}px
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>
          <strong>화면 크기 분류:</strong>
          {windowSize.width < 768
            ? " 모바일"
            : windowSize.width < 1024
            ? " 태블릿"
            : " 데스크톱"}
        </div>
      </div>

      {/* 4. useToggle 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>🔄 useToggle 훅</h4>

        <div style={{ marginBottom: "10px" }}>
          <label>가시성:</label>
          <button
            onClick={toggleVisibility}
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
              backgroundColor: isVisible ? "#28a745" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {isVisible ? "숨기기" : "보이기"}
          </button>
          <span style={{ marginLeft: "10px" }}>
            상태: {isVisible ? "보임" : "숨김"}
          </span>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>활성화:</label>
          <button
            onClick={toggleEnabled}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            토글
          </button>
          <button
            onClick={enable}
            style={{
              marginLeft: "5px",
              padding: "5px 10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            활성화
          </button>
          <button
            onClick={disable}
            style={{
              marginLeft: "5px",
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            비활성화
          </button>
          <span style={{ marginLeft: "10px" }}>
            상태: {isEnabled ? "활성" : "비활성"}
          </span>
        </div>

        {isVisible && (
          <div
            style={{
              padding: "10px",
              backgroundColor: "#e9ecef",
              borderRadius: "4px",
            }}
          >
            <p>이 내용은 토글 버튼으로 보이거나 숨겨집니다!</p>
          </div>
        )}
      </div>

      {/* 5. usePrevious 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>📊 usePrevious 훅</h4>
        <p>이전 값과 현재 값을 비교해보세요!</p>

        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={() => setCurrentValue((prev) => prev + 1)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            값 증가
          </button>
          <button
            onClick={() => setCurrentValue(0)}
            style={{
              marginLeft: "10px",
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            리셋
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <strong>이전 값:</strong>{" "}
            {previousValue !== undefined ? previousValue : "없음"}
          </div>
          <div>
            <strong>현재 값:</strong> {currentValue}
          </div>
        </div>

        {previousValue !== undefined && (
          <div style={{ marginTop: "10px" }}>
            <strong>변화량:</strong> {currentValue - previousValue}
          </div>
        )}
      </div>

      {/* 커스텀 훅 설명 */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#e7f3ff",
          border: "1px solid #b3d9ff",
          borderRadius: "4px",
        }}
      >
        <h4>💡 커스텀 훅의 장점</h4>
        <ul>
          <li>
            <strong>재사용성:</strong> 여러 컴포넌트에서 동일한 로직 사용
          </li>
          <li>
            <strong>가독성:</strong> 복잡한 로직을 간단한 인터페이스로 추상화
          </li>
          <li>
            <strong>테스트 용이성:</strong> 로직을 독립적으로 테스트 가능
          </li>
          <li>
            <strong>타입 안전성:</strong> TypeScript와 완벽한 통합
          </li>
          <li>
            <strong>관심사 분리:</strong> UI와 비즈니스 로직 분리
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomHooksDemo;
