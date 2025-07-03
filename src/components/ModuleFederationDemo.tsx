import React, { useState, useEffect, lazy, Suspense } from "react";

// 동적 임포트를 위한 lazy 컴포넌트들
const LazyUserApp = lazy(() => import("./micro-apps/UserApp"));

// 마이크로 앱 인터페이스
interface MicroAppConfig {
  id: string;
  name: string;
  description: string;
  component: React.LazyExoticComponent<any>;
  dependencies: string[];
  team: string;
  lastDeployed: string;
  version: string;
}

// Module Federation 설정 시뮬레이션
const moduleFederationConfig = {
  name: "shell-app",
  remotes: {
    "user-app": "userApp@http://localhost:3001/remoteEntry.js",
    "product-app": "productApp@http://localhost:3002/remoteEntry.js",
    "order-app": "orderApp@http://localhost:3003/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^18.0.0" },
    "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
  },
};

// 마이크로 앱 설정
const microApps: MicroAppConfig[] = [
  {
    id: "user-app",
    name: "사용자 관리 앱",
    description: "사용자 등록, 수정, 삭제 및 권한 관리",
    component: LazyUserApp,
    dependencies: ["react", "react-dom", "shared-ui"],
    team: "User Team",
    lastDeployed: "2024-01-15",
    version: "1.2.0",
  },
];

// 공통 상태 관리 (실제로는 Redux, Zustand 등 사용)
interface SharedState {
  user: {
    id: string;
    name: string;
    role: string;
  } | null;
  theme: "light" | "dark";
  language: "ko" | "en";
}

const ModuleFederationDemo: React.FC<{ title: string }> = ({ title }) => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [sharedState, setSharedState] = useState<SharedState>({
    user: { id: "1", name: "김철수", role: "admin" },
    theme: "light",
    language: "ko",
  });
  const [appLoadTimes, setAppLoadTimes] = useState<Record<string, number>>({});
  const [appErrors, setAppErrors] = useState<Record<string, string>>({});

  const handleAppSelect = (appId: string) => {
    const startTime = performance.now();
    setSelectedApp(appId);

    // 앱 로딩 시간 측정
    setTimeout(() => {
      const endTime = performance.now();
      setAppLoadTimes((prev) => ({
        ...prev,
        [appId]: endTime - startTime,
      }));
    }, 100);
  };

  const handleSharedStateChange = (key: keyof SharedState, value: any) => {
    setSharedState((prev) => ({ ...prev, [key]: value }));
  };

  const handleAppError = (appId: string, error: Error) => {
    setAppErrors((prev) => ({ ...prev, [appId]: error.message }));
  };

  return (
    <div
      style={{
        border: "2px solid #17a2b8",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px 0",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h2 style={{ color: "#17a2b8", marginBottom: "20px" }}>{title}</h2>

      <div style={{ marginBottom: "30px" }}>
        <h3>🔗 Module Federation 구현</h3>
        <p>
          Webpack 5의 Module Federation을 사용한 실제 마이크로 프론트엔드 구현을
          시뮬레이션합니다.
        </p>

        <div
          style={{
            backgroundColor: "#e9ecef",
            padding: "15px",
            borderRadius: "5px",
            margin: "10px 0",
          }}
        >
          <h4>⚙️ Module Federation 설정</h4>
          <pre
            style={{
              backgroundColor: "#f8f9fa",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "12px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(moduleFederationConfig, null, 2)}
          </pre>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 왼쪽: 앱 선택 및 실행 */}
        <div>
          <h3>🚀 마이크로 앱 실행</h3>

          <div style={{ marginBottom: "20px" }}>
            <h4>앱 선택</h4>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "15px",
              }}
            >
              {microApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleAppSelect(app.id)}
                  style={{
                    padding: "10px 16px",
                    border:
                      selectedApp === app.id
                        ? "2px solid #17a2b8"
                        : "1px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor:
                      selectedApp === app.id ? "#17a2b8" : "#fff",
                    color: selectedApp === app.id ? "#fff" : "#333",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {app.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>앱 정보</h4>
            {selectedApp && (
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              >
                {(() => {
                  const app = microApps.find((a) => a.id === selectedApp);
                  if (!app) return null;

                  return (
                    <div>
                      <h5>{app.name}</h5>
                      <p>
                        <strong>설명:</strong> {app.description}
                      </p>
                      <p>
                        <strong>팀:</strong> {app.team}
                      </p>
                      <p>
                        <strong>버전:</strong> {app.version}
                      </p>
                      <p>
                        <strong>마지막 배포:</strong> {app.lastDeployed}
                      </p>
                      <p>
                        <strong>의존성:</strong> {app.dependencies.join(", ")}
                      </p>
                      {appLoadTimes[app.id] && (
                        <p>
                          <strong>로딩 시간:</strong>{" "}
                          {appLoadTimes[app.id].toFixed(2)}ms
                        </p>
                      )}
                      {appErrors[app.id] && (
                        <p style={{ color: "#dc3545" }}>
                          <strong>오류:</strong> {appErrors[app.id]}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 공유 상태 및 아키텍처 */}
        <div>
          <h3>🔄 공유 상태 관리</h3>

          <div style={{ marginBottom: "20px" }}>
            <h4>전역 상태</h4>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <label>
                  <strong>사용자:</strong>
                  <select
                    value={sharedState.user?.id || ""}
                    onChange={(e) => {
                      const users = [
                        { id: "1", name: "김철수", role: "admin" },
                        { id: "2", name: "이영희", role: "user" },
                        { id: "3", name: "박민수", role: "manager" },
                      ];
                      const user = users.find((u) => u.id === e.target.value);
                      handleSharedStateChange("user", user);
                    }}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    <option value="1">김철수 (관리자)</option>
                    <option value="2">이영희 (사용자)</option>
                    <option value="3">박민수 (매니저)</option>
                  </select>
                </label>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label>
                  <strong>테마:</strong>
                  <select
                    value={sharedState.theme}
                    onChange={(e) =>
                      handleSharedStateChange("theme", e.target.value)
                    }
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    <option value="light">라이트</option>
                    <option value="dark">다크</option>
                  </select>
                </label>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label>
                  <strong>언어:</strong>
                  <select
                    value={sharedState.language}
                    onChange={(e) =>
                      handleSharedStateChange("language", e.target.value)
                    }
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                  </select>
                </label>
              </div>

              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                }}
              >
                <strong>현재 상태:</strong>
                <pre>{JSON.stringify(sharedState, null, 2)}</pre>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>🏗️ 아키텍처 구조</h4>
            <div
              style={{
                backgroundColor: "#d1ecf1",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>Shell App:</strong> 메인 컨테이너 애플리케이션
              </p>
              <p>
                <strong>Remote Apps:</strong> 독립적으로 배포되는 마이크로 앱들
              </p>
              <p>
                <strong>Shared Dependencies:</strong> 공통 라이브러리 (React, UI
                컴포넌트)
              </p>
              <p>
                <strong>Module Federation:</strong> 런타임 모듈 로딩 및 공유
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>📦 번들 분석</h4>
            <div
              style={{
                backgroundColor: "#fff3cd",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>Shell Bundle:</strong> 150KB (공통 코드)
              </p>
              <p>
                <strong>User App:</strong> 80KB (사용자 관리 기능)
              </p>
              <p>
                <strong>Product App:</strong> 120KB (상품 관리 기능)
              </p>
              <p>
                <strong>Order App:</strong> 100KB (주문 관리 기능)
              </p>
              <p>
                <strong>총 크기:</strong> 450KB (모놀리식 대비 30% 감소)
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>🚀 배포 파이프라인</h4>
            <div
              style={{
                backgroundColor: "#d4edda",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>1. 빌드:</strong> 각 앱 독립적 빌드
              </p>
              <p>
                <strong>2. 테스트:</strong> 단위 및 통합 테스트
              </p>
              <p>
                <strong>3. 배포:</strong> CDN에 정적 자산 배포
              </p>
              <p>
                <strong>4. 검증:</strong> 헬스 체크 및 기능 검증
              </p>
              <p>
                <strong>5. 전환:</strong> 트래픽 전환 (Blue-Green)
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
        <h3>💡 Module Federation 모범 사례</h3>
        <ul>
          <li>
            <strong>공통 의존성 관리:</strong> React, React-DOM 등은
            singleton으로 설정
          </li>
          <li>
            <strong>버전 호환성:</strong> 모든 앱이 호환되는 버전 사용
          </li>
          <li>
            <strong>지연 로딩:</strong> 필요할 때만 앱 로드 (lazy loading)
          </li>
          <li>
            <strong>오류 경계:</strong> 각 앱에 오류 경계 설정
          </li>
          <li>
            <strong>타입 안전성:</strong> TypeScript로 인터페이스 정의
          </li>
          <li>
            <strong>성능 모니터링:</strong> 번들 크기 및 로딩 시간 추적
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModuleFederationDemo;
