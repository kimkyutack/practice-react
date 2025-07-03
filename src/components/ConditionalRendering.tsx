import React, { useState } from "react";

interface ConditionalRenderingProps {
  title: string;
}

const ConditionalRendering: React.FC<ConditionalRenderingProps> = ({
  title,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<"admin" | "user" | "guest">("guest");
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [items, setItems] = useState<string[]>([]);

  // 1. 삼항 연산자를 사용한 조건부 렌더링
  const renderLoginStatus = () => {
    return isLoggedIn ? (
      <div style={{ color: "green", fontWeight: "bold" }}>로그인됨 ✅</div>
    ) : (
      <div style={{ color: "red", fontWeight: "bold" }}>로그아웃됨 ❌</div>
    );
  };

  // 2. && 연산자를 사용한 조건부 렌더링
  const renderAdminPanel = () => {
    return (
      userRole === "admin" && (
        <div
          style={{
            backgroundColor: "#ff6b6b",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            margin: "10px 0",
          }}
        >
          🔐 관리자 패널 (관리자만 볼 수 있음)
        </div>
      )
    );
  };

  // 3. switch 문을 사용한 조건부 렌더링
  const renderUserInfo = () => {
    switch (userRole) {
      case "admin":
        return (
          <div style={{ color: "#ff6b6b", fontWeight: "bold" }}>
            관리자 권한
          </div>
        );
      case "user":
        return (
          <div style={{ color: "#4ecdc4", fontWeight: "bold" }}>
            일반 사용자 권한
          </div>
        );
      case "guest":
        return (
          <div style={{ color: "#95a5a6", fontWeight: "bold" }}>
            게스트 권한
          </div>
        );
      default:
        return null;
    }
  };

  // 4. 조건부 스타일링
  const getButtonStyle = (role: "admin" | "user" | "guest") => {
    const baseStyle = {
      padding: "8px 16px",
      margin: "5px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
    };

    switch (role) {
      case "admin":
        return { ...baseStyle, backgroundColor: "#ff6b6b", color: "white" };
      case "user":
        return { ...baseStyle, backgroundColor: "#4ecdc4", color: "white" };
      case "guest":
        return { ...baseStyle, backgroundColor: "#95a5a6", color: "white" };
    }
  };

  // 5. 조건부 클래스명
  const getContainerClass = () => {
    const baseClass = "conditional-container";
    return `${baseClass} ${isLoggedIn ? "logged-in" : "logged-out"}`;
  };

  return (
    <div
      style={{
        border: "2px solid #28a745",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "600px",
      }}
    >
      <h3>{title}</h3>

      {/* 로그인 상태 표시 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>1. 삼항 연산자 조건부 렌더링</h4>
        {renderLoginStatus()}
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={{ marginTop: "10px", padding: "8px 16px" }}
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </button>
      </div>

      {/* 사용자 역할 선택 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>2. && 연산자 조건부 렌더링</h4>
        <p>역할 선택:</p>
        <button
          onClick={() => setUserRole("admin")}
          style={getButtonStyle("admin")}
        >
          관리자
        </button>
        <button
          onClick={() => setUserRole("user")}
          style={getButtonStyle("user")}
        >
          사용자
        </button>
        <button
          onClick={() => setUserRole("guest")}
          style={getButtonStyle("guest")}
        >
          게스트
        </button>

        {renderUserInfo()}
        {renderAdminPanel()}
      </div>

      {/* 상세 정보 토글 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>3. 조건부 상세 정보</h4>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{ padding: "8px 16px" }}
        >
          {showDetails ? "상세 정보 숨기기" : "상세 정보 보기"}
        </button>

        {showDetails && (
          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
            }}
          >
            <p>📊 상세 정보:</p>
            <ul>
              <li>로그인 상태: {isLoggedIn ? "활성" : "비활성"}</li>
              <li>사용자 역할: {userRole}</li>
              <li>컴포넌트 생성 시간: {new Date().toLocaleTimeString()}</li>
            </ul>
          </div>
        )}
      </div>

      {/* 조건부 리스트 렌더링 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>4. 조건부 리스트 렌더링</h4>
        <button
          onClick={() => setItems([...items, `아이템 ${items.length + 1}`])}
          style={{ marginRight: "10px", padding: "8px 16px" }}
        >
          아이템 추가
        </button>
        <button onClick={() => setItems([])} style={{ padding: "8px 16px" }}>
          모두 삭제
        </button>

        {items.length === 0 ? (
          <p style={{ color: "#6c757d", fontStyle: "italic" }}>
            아이템이 없습니다. 추가해보세요!
          </p>
        ) : (
          <ul style={{ marginTop: "10px" }}>
            {items.map((item, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 조건부 스타일링 */}
      <div
        style={{
          padding: "15px",
          borderRadius: "4px",
          backgroundColor: isLoggedIn ? "#d4edda" : "#f8d7da",
          border: `1px solid ${isLoggedIn ? "#c3e6cb" : "#f5c6cb"}`,
        }}
      >
        <h4>5. 조건부 스타일링</h4>
        <p>
          이 영역의 배경색은 로그인 상태에 따라 변경됩니다.
          {isLoggedIn ? " (로그인됨 - 초록색)" : " (로그아웃됨 - 빨간색)"}
        </p>
      </div>
    </div>
  );
};

export default ConditionalRendering;
