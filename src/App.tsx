import React, { useState } from "react";
import "./App.css";
import Counter from "./components/Counter";
import EventHandlingDemo from "./components/EventHandlingDemo";
import ConditionalRendering from "./components/ConditionalRendering";
import ListRendering from "./components/ListRendering";
import UseEffectDemo from "./components/UseEffectDemo";
import ContextDemo from "./components/ContextDemo";
import CustomHooksDemo from "./components/CustomHooksDemo";
import PerformanceDemo from "./components/PerformanceDemo";
import TypeScriptAdvanced from "./components/TypeScriptAdvanced";
import TestingDemo from "./components/TestingDemo";
import MicroFrontendDemo from "./components/MicroFrontendDemo";
import ModuleFederationDemo from "./components/ModuleFederationDemo";
import ReactQueryDemo from "./components/ReactQueryDemo";
import ZustandDemo from "./components/ZustandDemo";

function App() {
  const [activeDemo, setActiveDemo] = useState<string>("intro");

  const demos = [
    { id: "intro", name: "🏠 소개", component: null },
    { id: "counter", name: "🔢 카운터", component: <Counter /> },
    {
      id: "events",
      name: "🎯 이벤트 핸들링",
      component: <EventHandlingDemo title="이벤트 핸들링 심화" />,
    },
    {
      id: "conditional",
      name: "🔀 조건부 렌더링",
      component: <ConditionalRendering title="조건부 렌더링" />,
    },
    {
      id: "list",
      name: "📋 리스트 렌더링",
      component: <ListRendering title="리스트 렌더링과 키(Key)" />,
    },
    {
      id: "useEffect",
      name: "⚡ useEffect",
      component: <UseEffectDemo title="useEffect 훅" />,
    },
    {
      id: "context",
      name: "🌐 Context API",
      component: <ContextDemo title="Context API - 전역 상태 관리" />,
    },
    {
      id: "customHooks",
      name: "🎣 커스텀 훅",
      component: <CustomHooksDemo title="커스텀 훅 만들기" />,
    },
    {
      id: "performance",
      name: "🚀 성능 최적화",
      component: (
        <PerformanceDemo title="성능 최적화 - React.memo, useMemo, useCallback" />
      ),
    },
    {
      id: "typescript",
      name: "📘 TypeScript 고급",
      component: (
        <TypeScriptAdvanced title="TypeScript 고급 기능 - 제네릭, 타입 가드, 조건부 타입" />
      ),
    },
    {
      id: "testing",
      name: "🧪 테스팅",
      component: <TestingDemo title="테스팅 - Jest와 React Testing Library" />,
    },
    {
      id: "microfrontend",
      name: "🏗️ 마이크로 프론트엔드",
      component: (
        <MicroFrontendDemo title="마이크로 프론트엔드 아키텍처 - 기본 개념" />
      ),
    },
    {
      id: "moduleFederation",
      name: "🔗 Module Federation",
      component: <ModuleFederationDemo title="Module Federation - 실제 구현" />,
    },
    {
      id: "reactQuery",
      name: "🔄 React Query",
      component: <ReactQueryDemo title="React Query (TanStack Query) 데모" />,
    },
    {
      id: "zustand",
      name: "📦 Zustand",
      component: <ZustandDemo title="Zustand 상태 관리 데모" />,
    },
  ];

  const renderIntro = () => (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ color: "#333", textAlign: "center", marginBottom: "30px" }}>
        🚀 React & TypeScript 학습 가이드
      </h1>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h2>📚 학습 목표</h2>
        <p>
          이 프로젝트는 React와 TypeScript를 단계별로 학습할 수 있도록 구성되어
          있습니다. 각 데모를 통해 실습하며 개념을 익혀보세요!
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#e7f3ff",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h2>🎯 학습 순서</h2>
        <ol>
          <li>
            <strong>기본 컴포넌트:</strong> 카운터, 이벤트 핸들링
          </li>
          <li>
            <strong>렌더링 기법:</strong> 조건부 렌더링, 리스트 렌더링
          </li>
          <li>
            <strong>React 훅:</strong> useEffect, Context API
          </li>
          <li>
            <strong>고급 기능:</strong> 커스텀 훅, 성능 최적화
          </li>
          <li>
            <strong>TypeScript:</strong> 고급 타입 기능
          </li>
          <li>
            <strong>테스팅:</strong> Jest와 React Testing Library
          </li>
          <li>
            <strong>아키텍처:</strong> 마이크로 프론트엔드
          </li>
          <li>
            <strong>상태 관리:</strong> React Query, Zustand
          </li>
        </ol>
      </div>

      <div
        style={{
          backgroundColor: "#fff3cd",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>💡 사용법</h2>
        <p>
          왼쪽 메뉴에서 원하는 데모를 선택하여 학습을 시작하세요. 각 데모는 실제
          코드와 함께 개념을 설명합니다.
        </p>
      </div>
    </div>
  );

  return (
    <div className="App">
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* 사이드바 */}
        <div
          style={{
            width: "250px",
            backgroundColor: "#343a40",
            color: "#fff",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
            📖 데모 목록
          </h2>
          <nav>
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "8px",
                  backgroundColor:
                    activeDemo === demo.id ? "#007bff" : "transparent",
                  color: "#fff",
                  border: "1px solid #495057",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (activeDemo !== demo.id) {
                    e.currentTarget.style.backgroundColor = "#495057";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeDemo !== demo.id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {demo.name}
              </button>
            ))}
          </nav>
        </div>

        {/* 메인 콘텐츠 */}
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {activeDemo === "intro"
            ? renderIntro()
            : demos.find((demo) => demo.id === activeDemo)?.component}
        </div>
      </div>
    </div>
  );
}

export default App;
