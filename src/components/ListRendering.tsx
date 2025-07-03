import React, { useState } from "react";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

interface ListRenderingProps {
  title: string;
}

const ListRendering: React.FC<ListRenderingProps> = ({ title }) => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "React 배우기", completed: false, priority: "high" },
    { id: 2, text: "TypeScript 배우기", completed: false, priority: "high" },
    { id: 3, text: "프로젝트 만들기", completed: false, priority: "medium" },
  ]);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // 1. 새로운 할 일 추가
  const addTodo = (): void => {
    if (newTodoText.trim() === "") return;

    const newTodo: TodoItem = {
      id: Date.now(), // 고유한 ID 생성
      text: newTodoText,
      completed: false,
      priority: "medium",
    };

    setTodos([...todos, newTodo]);
    setNewTodoText("");
  };

  // 2. 할 일 완료/미완료 토글
  const toggleTodo = (id: number): void => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 3. 할 일 삭제
  const deleteTodo = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 4. 우선순위 변경
  const changePriority = (
    id: number,
    priority: "low" | "medium" | "high"
  ): void => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
    );
  };

  // 5. 필터링된 할 일 목록
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "active":
        return !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  // 6. 우선순위별 색상
  const getPriorityColor = (priority: "low" | "medium" | "high"): string => {
    switch (priority) {
      case "high":
        return "#dc3545";
      case "medium":
        return "#ffc107";
      case "low":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  // 7. 통계 계산
  const stats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    active: todos.filter((todo) => !todo.completed).length,
    highPriority: todos.filter((todo) => todo.priority === "high").length,
  };

  return (
    <div
      style={{
        border: "2px solid #6f42c1",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "700px",
      }}
    >
      <h3>{title}</h3>

      {/* 통계 */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <div>전체: {stats.total}</div>
        <div>완료: {stats.completed}</div>
        <div>미완료: {stats.active}</div>
        <div>높은 우선순위: {stats.highPriority}</div>
      </div>

      {/* 새 할 일 추가 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>새 할 일 추가</h4>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="할 일을 입력하세요"
            style={{ flex: 1, padding: "8px" }}
          />
          <button onClick={addTodo} style={{ padding: "8px 16px" }}>
            추가
          </button>
        </div>
      </div>

      {/* 필터 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>필터</h4>
        <div style={{ display: "flex", gap: "10px" }}>
          {(["all", "active", "completed"] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              style={{
                padding: "8px 16px",
                backgroundColor:
                  filter === filterOption ? "#007bff" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {filterOption === "all"
                ? "전체"
                : filterOption === "active"
                ? "미완료"
                : "완료"}
            </button>
          ))}
        </div>
      </div>

      {/* 할 일 목록 */}
      <div>
        <h4>할 일 목록</h4>
        {filteredTodos.length === 0 ? (
          <p style={{ color: "#6c757d", fontStyle: "italic" }}>
            {filter === "all"
              ? "할 일이 없습니다."
              : filter === "active"
              ? "미완료된 할 일이 없습니다."
              : "완료된 할 일이 없습니다."}
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredTodos.map((todo) => (
              <li
                key={todo.id} // 중요: 고유한 key 사용
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  margin: "5px 0",
                  backgroundColor: todo.completed ? "#e9ecef" : "white",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {/* 완료 체크박스 */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ marginRight: "10px" }}
                />

                {/* 할 일 텍스트 */}
                <span style={{ flex: 1, marginRight: "10px" }}>
                  {todo.text}
                </span>

                {/* 우선순위 표시 */}
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "white",
                    backgroundColor: getPriorityColor(todo.priority),
                    marginRight: "10px",
                  }}
                >
                  {todo.priority === "high"
                    ? "높음"
                    : todo.priority === "medium"
                    ? "보통"
                    : "낮음"}
                </span>

                {/* 우선순위 변경 버튼들 */}
                <div
                  style={{ display: "flex", gap: "5px", marginRight: "10px" }}
                >
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => changePriority(todo.id, priority)}
                      style={{
                        padding: "2px 6px",
                        fontSize: "10px",
                        backgroundColor: getPriorityColor(priority),
                        color: "white",
                        border: "none",
                        borderRadius: "2px",
                        cursor: "pointer",
                      }}
                    >
                      {priority === "high"
                        ? "H"
                        : priority === "medium"
                        ? "M"
                        : "L"}
                    </button>
                  ))}
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 키(Key)의 중요성 설명 */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
        }}
      >
        <h4>💡 Key의 중요성</h4>
        <p>
          React에서 리스트를 렌더링할 때 <code>key</code> prop은 필수입니다.
          Key는 React가 각 요소를 고유하게 식별하고 효율적으로 업데이트할 수
          있게 해줍니다.
        </p>
        <ul>
          <li>
            ✅ <code>key=&#123;todo.id&#125;</code> - 고유한 ID 사용 (권장)
          </li>
          <li>
            ❌ <code>key=&#123;index&#125;</code> - 배열 인덱스 사용 (비권장)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ListRendering;
