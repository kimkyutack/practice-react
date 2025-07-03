import React, { useState, useEffect } from "react";

// 마이크로 프론트엔드 인터페이스 정의
interface MicroApp {
  id: string;
  name: string;
  url: string;
  description: string;
  status: "loading" | "loaded" | "error";
  component?: React.ComponentType<any>;
}

// 마이크로 프론트엔드 컨테이너 컴포넌트
interface MicroAppContainerProps {
  app: MicroApp;
  onAppLoad?: (appId: string) => void;
  onAppError?: (appId: string, error: Error) => void;
}

const MicroAppContainer: React.FC<MicroAppContainerProps> = ({
  app,
  onAppLoad,
  onAppError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 마이크로 앱 로딩 시뮬레이션
    const loadApp = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 실제로는 여기서 원격 앱을 동적으로 로드
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsLoading(false);
        onAppLoad?.(app.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "앱 로딩 실패");
        onAppError?.(
          app.id,
          err instanceof Error ? err : new Error("앱 로딩 실패")
        );
      }
    };

    loadApp();
  }, [app.id, onAppLoad, onAppError]);

  if (isLoading) {
    return (
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>⏳</div>
          <p>{app.name} 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          border: "1px solid #dc3545",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "10px" }}>❌</div>
          <h4>{app.name} 로딩 실패</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #28a745",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#d4edda",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "24px", marginBottom: "10px" }}>✅</div>
        <h4>{app.name}</h4>
        <p>{app.description}</p>
        <small>URL: {app.url}</small>
      </div>
    </div>
  );
};

// 마이크로 프론트엔드 데모 컴포넌트
interface MicroFrontendDemoProps {
  title: string;
}

const MicroFrontendDemo: React.FC<MicroFrontendDemoProps> = ({ title }) => {
  const [microApps, setMicroApps] = useState<MicroApp[]>([
    {
      id: "user-management",
      name: "사용자 관리",
      url: "https://user-app.example.com",
      description: "사용자 등록, 수정, 삭제 기능",
      status: "loading",
    },
    {
      id: "product-catalog",
      name: "상품 카탈로그",
      url: "https://product-app.example.com",
      description: "상품 목록, 검색, 필터링 기능",
      status: "loading",
    },
    {
      id: "order-management",
      name: "주문 관리",
      url: "https://order-app.example.com",
      description: "주문 생성, 조회, 상태 관리 기능",
      status: "loading",
    },
    {
      id: "analytics-dashboard",
      name: "분석 대시보드",
      url: "https://analytics-app.example.com",
      description: "데이터 시각화 및 분석 기능",
      status: "loading",
    },
  ]);

  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [appLoadHistory, setAppLoadHistory] = useState<string[]>([]);

  const handleAppLoad = (appId: string) => {
    setMicroApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: "loaded" } : app))
    );
    setAppLoadHistory((prev) => [...prev, `${appId} 로드됨`]);
  };

  const handleAppError = (appId: string, error: Error) => {
    setMicroApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: "error" } : app))
    );
    setAppLoadHistory((prev) => [
      ...prev,
      `${appId} 로드 실패: ${error.message}`,
    ]);
  };

  const reloadApp = (appId: string) => {
    setMicroApps((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: "loading" } : app
      )
    );
  };

  return (
    <div
      style={{
        border: "2px solid #6f42c1",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px 0",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h2 style={{ color: "#6f42c1", marginBottom: "20px" }}>{title}</h2>

      <div style={{ marginBottom: "30px" }}>
        <h3>🏗️ 마이크로 프론트엔드 아키텍처 개요</h3>
        <p>
          대규모 애플리케이션을 독립적인 작은 앱들로 분리하여 개발하는 아키텍처
          패턴입니다.
        </p>

        <div
          style={{
            backgroundColor: "#e9ecef",
            padding: "15px",
            borderRadius: "5px",
            margin: "10px 0",
          }}
        >
          <h4>🎯 마이크로 프론트엔드의 장점</h4>
          <ul>
            <li>
              <strong>독립적 개발:</strong> 각 팀이 독립적으로 개발 가능
            </li>
            <li>
              <strong>기술 스택 자유:</strong> 각 앱마다 다른 기술 사용 가능
            </li>
            <li>
              <strong>배포 독립성:</strong> 개별 앱을 독립적으로 배포
            </li>
            <li>
              <strong>확장성:</strong> 필요에 따라 앱 추가/제거 용이
            </li>
            <li>
              <strong>장애 격리:</strong> 한 앱의 문제가 전체에 영향 주지 않음
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 왼쪽: 마이크로 앱 시뮬레이션 */}
        <div>
          <h3>🚀 마이크로 앱 시뮬레이션</h3>

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
                  onClick={() => setSelectedApp(app.id)}
                  style={{
                    padding: "8px 16px",
                    border:
                      selectedApp === app.id
                        ? "2px solid #6f42c1"
                        : "1px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor:
                      selectedApp === app.id ? "#6f42c1" : "#fff",
                    color: selectedApp === app.id ? "#fff" : "#333",
                    cursor: "pointer",
                  }}
                >
                  {app.name}
                </button>
              ))}
            </div>
          </div>

          {selectedApp && (
            <div style={{ marginBottom: "20px" }}>
              <h4>선택된 앱</h4>
              <MicroAppContainer
                app={microApps.find((app) => app.id === selectedApp)!}
                onAppLoad={handleAppLoad}
                onAppError={handleAppError}
              />

              <button
                onClick={() => reloadApp(selectedApp)}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                앱 다시 로드
              </button>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <h4>모든 앱 상태</h4>
            <div style={{ display: "grid", gap: "10px" }}>
              {microApps.map((app) => (
                <div
                  key={app.id}
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{app.name}</strong>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {app.description}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "4px 8px",
                      borderRadius: "3px",
                      fontSize: "12px",
                      backgroundColor:
                        app.status === "loaded"
                          ? "#d4edda"
                          : app.status === "error"
                          ? "#f8d7da"
                          : "#fff3cd",
                      color:
                        app.status === "loaded"
                          ? "#155724"
                          : app.status === "error"
                          ? "#721c24"
                          : "#856404",
                    }}
                  >
                    {app.status === "loaded"
                      ? "✅ 로드됨"
                      : app.status === "error"
                      ? "❌ 오류"
                      : "⏳ 로딩중"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 아키텍처 설명 */}
        <div>
          <h3>📋 아키텍처 패턴</h3>

          <div style={{ marginBottom: "20px" }}>
            <h4>🏗️ 구현 방식</h4>
            <div
              style={{
                backgroundColor: "#fff3cd",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>Module Federation:</strong> Webpack 5의 모듈 페더레이션
              </p>
              <p>
                <strong>Single-SPA:</strong> 라우팅 기반 마이크로 프론트엔드
              </p>
              <p>
                <strong>iFrames:</strong> 격리된 환경에서 앱 실행
              </p>
              <p>
                <strong>Web Components:</strong> 표준 웹 컴포넌트 사용
              </p>
              <p>
                <strong>Server-Side Includes:</strong> 서버에서 조합
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>🔧 기술적 고려사항</h4>
            <div
              style={{
                backgroundColor: "#d1ecf1",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>라우팅:</strong> 앱 간 네비게이션 관리
              </p>
              <p>
                <strong>상태 관리:</strong> 전역 상태 공유 방법
              </p>
              <p>
                <strong>스타일링:</strong> CSS 충돌 방지
              </p>
              <p>
                <strong>성능:</strong> 번들 크기 및 로딩 최적화
              </p>
              <p>
                <strong>보안:</strong> 앱 간 격리 및 권한 관리
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>📊 아키텍처 비교</h4>
            <div
              style={{
                backgroundColor: "#d4edda",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>모놀리식:</strong> 모든 기능이 하나의 앱에
              </p>
              <p>
                <strong>마이크로 프론트엔드:</strong> 기능별로 독립적인 앱
              </p>
              <p>
                <strong>마이크로서비스:</strong> 백엔드 API 분리
              </p>
              <p>
                <strong>하이브리드:</strong> 여러 패턴 조합
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4>🚀 배포 전략</h4>
            <div
              style={{
                backgroundColor: "#f8d7da",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <p>
                <strong>Blue-Green:</strong> 무중단 배포
              </p>
              <p>
                <strong>Canary:</strong> 점진적 배포
              </p>
              <p>
                <strong>Feature Flags:</strong> 기능 토글
              </p>
              <p>
                <strong>CDN:</strong> 정적 자산 배포
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 앱 로드 히스토리 */}
      <div
        style={{
          backgroundColor: "#e9ecef",
          padding: "15px",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        <h3>📝 앱 로드 히스토리</h3>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        >
          {appLoadHistory.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              아직 로드된 앱이 없습니다.
            </p>
          ) : (
            appLoadHistory.map((entry, index) => (
              <div
                key={index}
                style={{
                  padding: "5px 0",
                  borderBottom:
                    index < appLoadHistory.length - 1
                      ? "1px solid #eee"
                      : "none",
                }}
              >
                <span style={{ color: "#666", fontSize: "12px" }}>
                  {new Date().toLocaleTimeString()}
                </span>
                <span style={{ marginLeft: "10px" }}>{entry}</span>
              </div>
            ))
          )}
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
        <h3>💡 마이크로 프론트엔드 모범 사례</h3>
        <ul>
          <li>
            <strong>명확한 경계:</strong> 각 앱의 책임과 경계를 명확히 정의
          </li>
          <li>
            <strong>공통 라이브러리:</strong> 공통 컴포넌트와 유틸리티 공유
          </li>
          <li>
            <strong>일관된 디자인:</strong> 디자인 시스템으로 UI 일관성 유지
          </li>
          <li>
            <strong>API 버전 관리:</strong> 앱 간 통신을 위한 API 버전 관리
          </li>
          <li>
            <strong>모니터링:</strong> 각 앱의 성능과 오류 모니터링
          </li>
          <li>
            <strong>문서화:</strong> 앱 간 통신 방식과 인터페이스 문서화
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MicroFrontendDemo;
