import React, { useState } from "react";
import {
  Counter,
  UserForm,
  UserList,
  ConditionalComponent,
} from "./TestableComponents";

interface TestingDemoProps {
  title: string;
}

const TestingDemo: React.FC<TestingDemoProps> = ({ title }) => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [formData, setFormData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "user" | "guest">("user");
  const [showDetails, setShowDetails] = useState(false);

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    alert(`폼 제출됨: ${JSON.stringify(data, null, 2)}`);
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(`${user.name} (${user.email})`);
  };

  return (
    <div
      style={{
        border: "2px solid #007bff",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px 0",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h2 style={{ color: "#007bff", marginBottom: "20px" }}>{title}</h2>

      <div style={{ marginBottom: "30px" }}>
        <h3>🧪 테스팅 개요</h3>
        <p>React Testing Library와 Jest를 사용한 테스팅 방법을 배워봅시다!</p>

        <div
          style={{
            backgroundColor: "#e9ecef",
            padding: "15px",
            borderRadius: "5px",
            margin: "10px 0",
          }}
        >
          <h4>📋 테스트 종류</h4>
          <ul>
            <li>
              <strong>단위 테스트:</strong> 개별 컴포넌트나 함수 테스트
            </li>
            <li>
              <strong>통합 테스트:</strong> 여러 컴포넌트 간 상호작용 테스트
            </li>
            <li>
              <strong>비동기 테스트:</strong> API 호출, 타이머 등 테스트
            </li>
            <li>
              <strong>접근성 테스트:</strong> 스크린 리더, 키보드 네비게이션
              테스트
            </li>
            <li>
              <strong>스냅샷 테스트:</strong> UI 변경사항 감지
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 왼쪽: 테스트할 컴포넌트들 */}
        <div>
          <h3>🎯 테스트 대상 컴포넌트</h3>

          <div style={{ marginBottom: "20px" }}>
            <h4>1. Counter 컴포넌트 (기본 테스트)</h4>
            <Counter
              initialValue={5}
              onCountChange={(count) => console.log("Count changed:", count)}
              label="테스트용 카운터"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>2. UserForm 컴포넌트 (폼 테스트)</h4>
            <UserForm onSubmit={handleFormSubmit} />
            {formData && (
              <div
                style={{
                  backgroundColor: "#d4edda",
                  padding: "10px",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              >
                <strong>제출된 데이터:</strong>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
              </div>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>3. UserList 컴포넌트 (비동기 테스트)</h4>
            <UserList onUserSelect={handleUserSelect} />
            {selectedUser && (
              <div
                style={{
                  backgroundColor: "#d1ecf1",
                  padding: "10px",
                  borderRadius: "5px",
                  marginTop: "10px",
                }}
              >
                <strong>선택된 사용자:</strong> {selectedUser}
              </div>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>4. ConditionalComponent (조건부 렌더링 테스트)</h4>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={isLoggedIn}
                  onChange={(e) => setIsLoggedIn(e.target.checked)}
                />
                로그인 상태
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                역할:
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  style={{ marginLeft: "10px" }}
                >
                  <option value="guest">게스트</option>
                  <option value="user">사용자</option>
                  <option value="admin">관리자</option>
                </select>
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={showDetails}
                  onChange={(e) => setShowDetails(e.target.checked)}
                />
                상세 정보 표시
              </label>
            </div>
            <ConditionalComponent
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              showDetails={showDetails}
            />
          </div>
        </div>

        {/* 오른쪽: 테스트 설명 */}
        <div>
          <h3>📝 테스트 작성 방법</h3>

          <div style={{ marginBottom: "20px" }}>
            <h4>🔍 테스트 선택자 (Queries)</h4>
            <div
              style={{
                backgroundColor: "#fff3cd",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>getByTestId:</strong> data-testid 속성으로 요소 찾기
              </p>
              <p>
                <strong>getByText:</strong> 텍스트 내용으로 요소 찾기
              </p>
              <p>
                <strong>getByLabelText:</strong> 라벨 텍스트로 폼 요소 찾기
              </p>
              <p>
                <strong>getByRole:</strong> ARIA 역할로 요소 찾기
              </p>
              <p>
                <strong>queryByTestId:</strong> 요소가 없을 때 null 반환
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>🎯 테스트 매처 (Matchers)</h4>
            <div
              style={{
                backgroundColor: "#d1ecf1",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>toBeInTheDocument():</strong> 요소가 DOM에 존재하는지
              </p>
              <p>
                <strong>toHaveTextContent():</strong> 텍스트 내용 확인
              </p>
              <p>
                <strong>toHaveValue():</strong> 입력 필드 값 확인
              </p>
              <p>
                <strong>toBeCalledWith():</strong> 함수 호출 인자 확인
              </p>
              <p>
                <strong>toMatchSnapshot():</strong> 스냅샷 테스트
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>⚡ 이벤트 시뮬레이션</h4>
            <div
              style={{
                backgroundColor: "#d4edda",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>fireEvent.click():</strong> 클릭 이벤트
              </p>
              <p>
                <strong>fireEvent.change():</strong> 입력 변경 이벤트
              </p>
              <p>
                <strong>fireEvent.submit():</strong> 폼 제출 이벤트
              </p>
              <p>
                <strong>fireEvent.keyDown():</strong> 키보드 이벤트
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>⏱️ 비동기 테스트</h4>
            <div
              style={{
                backgroundColor: "#f8d7da",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>waitFor():</strong> 조건이 만족될 때까지 대기
              </p>
              <p>
                <strong>act():</strong> React 상태 업데이트 래핑
              </p>
              <p>
                <strong>jest.useFakeTimers():</strong> 타이머 모킹
              </p>
              <p>
                <strong>jest.mock():</strong> 모듈 모킹
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>🧪 테스트 실행 명령어</h4>
            <div
              style={{
                backgroundColor: "#e2e3e5",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>npm test:</strong> 모든 테스트 실행
              </p>
              <p>
                <strong>npm test -- --watch:</strong> 감시 모드로 실행
              </p>
              <p>
                <strong>npm test -- --coverage:</strong> 커버리지 리포트 생성
              </p>
              <p>
                <strong>npm test Counter:</strong> 특정 테스트만 실행
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#e9ecef",
          padding: "15px",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        <h3>💡 테스팅 모범 사례</h3>
        <ul>
          <li>
            <strong>사용자 관점에서 테스트:</strong> 실제 사용자가 어떻게
            사용하는지 시뮬레이션
          </li>
          <li>
            <strong>data-testid 사용:</strong> 테스트 전용 속성으로 안정적인
            선택자 만들기
          </li>
          <li>
            <strong>설명적인 테스트 이름:</strong> 무엇을 테스트하는지 명확히
            표현
          </li>
          <li>
            <strong>AAA 패턴:</strong> Arrange(준비), Act(실행), Assert(검증)
          </li>
          <li>
            <strong>테스트 격리:</strong> 각 테스트가 독립적으로 실행되도록 보장
          </li>
          <li>
            <strong>접근성 고려:</strong> 스크린 리더와 키보드 네비게이션 테스트
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TestingDemo;
