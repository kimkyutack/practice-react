import React, { useState, useCallback } from "react";
import { create } from "zustand";

// Zustand 스토어 시뮬레이션 (실제 Zustand 라이브러리 사용)
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
  preferences: {
    theme: "light" | "dark";
    language: "ko" | "en";
    notifications: boolean;
  };
}

interface AppState {
  // Todo 관련 상태
  todos: Todo[];
  user: User | null;
  sidebarOpen: boolean;
  count: number;
}

// 함수형 Zustand 스토어 생성
const useStore = create<AppState>((set, get) => ({
  // 초기 상태
  todos: [],
  user: null,
  sidebarOpen: false,
  count: 0,
}));

// 함수형 액션들 (스토어 외부에서 정의)
const todoActions = {
  addTodo: (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    useStore.setState((state) => ({ todos: [...state.todos, newTodo] }));
  },

  toggleTodo: (id: number) => {
    useStore.setState((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  },

  removeTodo: (id: number) => {
    useStore.setState((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },

  clearCompleted: () => {
    useStore.setState((state) => ({
      todos: state.todos.filter((todo) => !todo.completed),
    }));
  },
};

const userActions = {
  setUser: (user: User) => {
    useStore.setState({ user });
  },

  updateUserPreferences: (preferences: Partial<User["preferences"]>) => {
    useStore.setState((state) => {
      if (state.user) {
        return {
          user: {
            ...state.user,
            preferences: { ...state.user.preferences, ...preferences },
          },
        };
      }
      return state;
    });
  },
};

const uiActions = {
  toggleSidebar: () => {
    useStore.setState((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
};

const counterActions = {
  increment: () => {
    useStore.setState((state) => ({ count: state.count + 1 }));
  },

  decrement: () => {
    useStore.setState((state) => ({ count: state.count - 1 }));
  },

  reset: () => {
    useStore.setState({ count: 0 });
  },
};

const ZustandDemo: React.FC<{ title: string }> = ({ title }) => {
  const [newTodoText, setNewTodoText] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  // Zustand 스토어에서 상태 가져오기
  const todos = useStore((state) => state.todos);
  const user = useStore((state) => state.user);
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const count = useStore((state) => state.count);

  const handleAddTodo = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newTodoText.trim()) {
        todoActions.addTodo(newTodoText.trim());
        setNewTodoText("");
      }
    },
    [newTodoText]
  );

  const handleCreateUser = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newUserName && newUserEmail) {
        const newUser: User = {
          id: Date.now(),
          name: newUserName,
          email: newUserEmail,
          preferences: {
            theme: "light",
            language: "ko",
            notifications: true,
          },
        };
        userActions.setUser(newUser);
        setNewUserName("");
        setNewUserEmail("");
      }
    },
    [newUserName, newUserEmail]
  );

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = todos.filter((todo) => !todo.completed).length;

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
        <h3>🔄 Zustand 개요</h3>
        <p>
          가볍고 사용하기 쉬운 상태 관리 라이브러리입니다. Redux의 복잡성 없이
          간단한 API로 전역 상태를 관리할 수 있습니다.
        </p>

        <div
          style={{
            backgroundColor: "#e9ecef",
            padding: "15px",
            borderRadius: "5px",
            margin: "10px 0",
          }}
        >
          <h4>🎯 Zustand의 장점</h4>
          <ul>
            <li>
              <strong>간단한 API:</strong> 보일러플레이트 코드가 거의 없음
            </li>
            <li>
              <strong>TypeScript 지원:</strong> 완벽한 타입 안전성
            </li>
            <li>
              <strong>번들 크기:</strong> 매우 작은 번들 크기 (2KB)
            </li>
            <li>
              <strong>React 독립적:</strong> React 없이도 사용 가능
            </li>
            <li>
              <strong>미들웨어:</strong> Redux DevTools, persist 등 지원
            </li>
            <li>
              <strong>성능:</strong> 불필요한 리렌더링 방지
            </li>
          </ul>
        </div>

        <div
          style={{
            backgroundColor: "#d4edda",
            padding: "15px",
            borderRadius: "5px",
            margin: "10px 0",
          }}
        >
          <h4>🔧 함수형 접근 방식</h4>
          <p>이 데모는 함수형 접근 방식을 사용합니다:</p>
          <ul>
            <li>
              <strong>스토어 분리:</strong> 상태와 액션을 분리하여 관리
            </li>
            <li>
              <strong>도메인별 그룹화:</strong> todoActions, userActions,
              uiActions, counterActions
            </li>
            <li>
              <strong>함수형 액션:</strong> 순수 함수로 액션 정의
            </li>
            <li>
              <strong>명확한 책임 분리:</strong> 각 액션 그룹이 특정 도메인 담당
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 왼쪽: Todo 앱 */}
        <div>
          <h3>📝 Todo 앱</h3>

          {/* Todo 추가 폼 */}
          <div style={{ marginBottom: "20px" }}>
            <form
              onSubmit={handleAddTodo}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            >
              <input
                type="text"
                placeholder="할 일을 입력하세요..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#6f42c1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                추가
              </button>
            </form>
          </div>

          {/* Todo 통계 */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#6f42c1",
                  }}
                >
                  {todos.length}
                </div>
                <div style={{ fontSize: "12px" }}>전체</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#28a745",
                  }}
                >
                  {activeTodos}
                </div>
                <div style={{ fontSize: "12px" }}>진행중</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#ffc107",
                  }}
                >
                  {completedTodos}
                </div>
                <div style={{ fontSize: "12px" }}>완료</div>
              </div>
            </div>
          </div>

          {/* Todo 목록 */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {todos.length === 0 ? (
              <div
                style={{ textAlign: "center", color: "#666", padding: "20px" }}
              >
                할 일이 없습니다. 새로운 할 일을 추가해보세요!
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    border: "1px solid #eee",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    backgroundColor: todo.completed ? "#f8f9fa" : "#fff",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => todoActions.toggleTodo(todo.id)}
                    style={{ marginRight: "10px" }}
                  />
                  <span
                    style={{
                      flex: 1,
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#666" : "#000",
                    }}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => todoActions.removeTodo(todo.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))
            )}

            {completedTodos > 0 && (
              <button
                onClick={todoActions.clearCompleted}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                완료된 항목 삭제
              </button>
            )}
          </div>
        </div>

        {/* 오른쪽: 사용자 관리 & 카운터 */}
        <div>
          <h3>👤 사용자 관리</h3>

          {/* 사용자 생성 */}
          {!user ? (
            <div style={{ marginBottom: "20px" }}>
              <h4>사용자 생성</h4>
              <form
                onSubmit={handleCreateUser}
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              >
                <input
                  type="text"
                  placeholder="이름"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                />
                <input
                  type="email"
                  placeholder="이메일"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "3px",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#6f42c1",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  사용자 생성
                </button>
              </form>
            </div>
          ) : (
            <div style={{ marginBottom: "20px" }}>
              <h4>사용자 정보</h4>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              >
                <div style={{ marginBottom: "10px" }}>
                  <strong>이름:</strong> {user.name}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>이메일:</strong> {user.email}
                </div>

                <h5>설정</h5>
                <div style={{ marginBottom: "10px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={user.preferences.notifications}
                      onChange={(e) =>
                        userActions.updateUserPreferences({
                          notifications: e.target.checked,
                        })
                      }
                      style={{ marginRight: "5px" }}
                    />
                    알림 받기
                  </label>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>
                    테마:
                    <select
                      value={user.preferences.theme}
                      onChange={(e) =>
                        userActions.updateUserPreferences({
                          theme: e.target.value as "light" | "dark",
                        })
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
                    언어:
                    <select
                      value={user.preferences.language}
                      onChange={(e) =>
                        userActions.updateUserPreferences({
                          language: e.target.value as "ko" | "en",
                        })
                      }
                      style={{ marginLeft: "10px", padding: "5px" }}
                    >
                      <option value="ko">한국어</option>
                      <option value="en">English</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 카운터 */}
          <div style={{ marginBottom: "20px" }}>
            <h3>🔢 카운터</h3>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#6f42c1",
                  marginBottom: "15px",
                }}
              >
                {count}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={counterActions.decrement}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>
                <button
                  onClick={counterActions.reset}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  리셋
                </button>
                <button
                  onClick={counterActions.increment}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 사이드바 토글 */}
          <div>
            <h3>🎛️ UI 상태</h3>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            >
              <button
                onClick={uiActions.toggleSidebar}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: sidebarOpen ? "#dc3545" : "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {sidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
              </button>
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                사이드바 상태: <strong>{sidebarOpen ? "열림" : "닫힘"}</strong>
              </div>
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
        <h3>💡 Zustand 함수형 접근 방식의 장점</h3>
        <ul>
          <li>
            <strong>명확한 책임 분리:</strong> 각 액션 그룹이 특정 도메인을 담당
          </li>
          <li>
            <strong>재사용성:</strong> 액션들을 다른 컴포넌트에서도 쉽게 사용
            가능
          </li>
          <li>
            <strong>테스트 용이성:</strong> 순수 함수로 정의되어 테스트하기 쉬움
          </li>
          <li>
            <strong>코드 구조화:</strong> 관련 기능들을 논리적으로 그룹화
          </li>
          <li>
            <strong>확장성:</strong> 새로운 액션을 쉽게 추가할 수 있음
          </li>
          <li>
            <strong>가독성:</strong> 코드의 의도가 명확하게 드러남
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ZustandDemo;
