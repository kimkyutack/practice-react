import React, { useState, useMemo, useCallback, memo } from "react";

// 1. React.memo를 사용한 최적화된 컴포넌트
interface ExpensiveComponentProps {
  value: number;
  onIncrement: () => void;
  title: string;
}

const ExpensiveComponent = memo<ExpensiveComponentProps>(
  ({ value, onIncrement, title }) => {
    // 의도적으로 무거운 계산을 시뮬레이션
    const expensiveCalculation = useMemo(() => {
      console.log(`${title} - 무거운 계산 실행 중...`);
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.random();
      }
      return result;
    }, [title]);

    return (
      <div
        style={{
          padding: "15px",
          border: "2px solid #007bff",
          borderRadius: "8px",
          margin: "10px 0",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h4>{title}</h4>
        <p>값: {value}</p>
        <p>계산 결과: {expensiveCalculation.toFixed(2)}</p>
        <button
          onClick={onIncrement}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          증가
        </button>
      </div>
    );
  }
);

// 2. 리스트 아이템 컴포넌트 (memo로 최적화)
interface ListItemProps {
  id: number;
  name: string;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newName: string) => void;
}

const ListItem = memo<ListItemProps>(({ id, name, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const handleSave = () => {
    onUpdate(id, editName);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        margin: "5px 0",
        backgroundColor: "white",
      }}
    >
      {isEditing ? (
        <>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{ flex: 1, marginRight: "10px", padding: "5px" }}
          />
          <button
            onClick={handleSave}
            style={{
              marginRight: "5px",
              padding: "5px 10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            저장
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              marginRight: "5px",
              padding: "5px 10px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            취소
          </button>
        </>
      ) : (
        <>
          <span style={{ flex: 1 }}>{name}</span>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              marginRight: "5px",
              padding: "5px 10px",
              backgroundColor: "#ffc107",
              color: "black",
              border: "none",
              borderRadius: "4px",
            }}
          >
            수정
          </button>
          <button
            onClick={() => onDelete(id)}
            style={{
              padding: "5px 10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            삭제
          </button>
        </>
      )}
    </div>
  );
});

// 3. 메인 성능 데모 컴포넌트
interface PerformanceDemoProps {
  title: string;
}

const PerformanceDemo: React.FC<PerformanceDemoProps> = ({ title }) => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [items, setItems] = useState([
    { id: 1, name: "아이템 1" },
    { id: 2, name: "아이템 2" },
    { id: 3, name: "아이템 3" },
  ]);
  const [filter, setFilter] = useState("");
  const [showExpensive, setShowExpensive] = useState(true);

  // 1. useCallback을 사용한 함수 메모이제이션
  const handleIncrement1 = useCallback(() => {
    setCount1((prev) => prev + 1);
  }, []);

  const handleIncrement2 = useCallback(() => {
    setCount2((prev) => prev + 1);
  }, []);

  const handleDeleteItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleUpdateItem = useCallback((id: number, newName: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  }, []);

  // 2. useMemo를 사용한 계산 결과 메모이제이션
  const filteredItems = useMemo(() => {
    console.log("필터링 계산 실행...");
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  const expensiveValue = useMemo(() => {
    console.log("무거운 계산 실행...");
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i);
    }
    return result;
  }, [count1]); // count1이 변경될 때만 재계산

  // 3. 객체 메모이제이션
  const memoizedObject = useMemo(
    () => ({
      count1,
      count2,
      total: count1 + count2,
    }),
    [count1, count2]
  );

  return (
    <div
      style={{
        border: "2px solid #28a745",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "800px",
      }}
    >
      <h3>{title}</h3>

      {/* 성능 모니터링 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#e7f3ff",
          borderRadius: "4px",
        }}
      >
        <h4>📊 성능 모니터링</h4>
        <p>개발자 도구의 콘솔을 열어서 리렌더링과 계산 실행을 확인하세요!</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>카운터 1: {count1}</div>
          <div>카운터 2: {count2}</div>
        </div>
        <div>무거운 계산 결과: {expensiveValue.toFixed(2)}</div>
      </div>

      {/* React.memo 데모 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>🔄 React.memo 데모</h4>
        <p>카운터를 변경해도 다른 컴포넌트는 리렌더링되지 않습니다.</p>

        <button
          onClick={() => setShowExpensive(!showExpensive)}
          style={{
            marginBottom: "10px",
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {showExpensive ? "무거운 컴포넌트 숨기기" : "무거운 컴포넌트 보이기"}
        </button>

        {showExpensive && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <ExpensiveComponent
              value={count1}
              onIncrement={handleIncrement1}
              title="컴포넌트 A"
            />
            <ExpensiveComponent
              value={count2}
              onIncrement={handleIncrement2}
              title="컴포넌트 B"
            />
          </div>
        )}
      </div>

      {/* useMemo 데모 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>🧮 useMemo 데모</h4>
        <p>필터나 아이템이 변경될 때만 필터링 계산이 실행됩니다.</p>

        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="아이템 필터링..."
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <div style={{ marginBottom: "10px" }}>
          <button
            onClick={() =>
              setItems((prev) => [
                ...prev,
                { id: Date.now(), name: `새 아이템 ${prev.length + 1}` },
              ])
            }
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            아이템 추가
          </button>
          <span>총 {filteredItems.length}개 아이템 (필터링됨)</span>
        </div>

        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {filteredItems.map((item) => (
            <ListItem
              key={item.id}
              id={item.id}
              name={item.name}
              onDelete={handleDeleteItem}
              onUpdate={handleUpdateItem}
            />
          ))}
        </div>
      </div>

      {/* useCallback vs 일반 함수 비교 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>⚡ useCallback vs 일반 함수</h4>
        <p>
          useCallback을 사용하면 함수 참조가 안정화되어 불필요한 리렌더링을
          방지합니다.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
            }}
          >
            <h5>✅ useCallback 사용</h5>
            <p>함수 참조가 안정화됨</p>
            <p>자식 컴포넌트 리렌더링 최소화</p>
          </div>
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "4px",
            }}
          >
            <h5>❌ 일반 함수</h5>
            <p>매 렌더링마다 새로운 함수 생성</p>
            <p>자식 컴포넌트 불필요한 리렌더링</p>
          </div>
        </div>
      </div>

      {/* 성능 최적화 팁 */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
        }}
      >
        <h4>💡 성능 최적화 팁</h4>
        <ul>
          <li>
            <strong>React.memo:</strong> props가 변경되지 않으면 리렌더링 방지
          </li>
          <li>
            <strong>useMemo:</strong> 계산 비용이 큰 연산 결과 메모이제이션
          </li>
          <li>
            <strong>useCallback:</strong> 함수 참조 안정화로 자식 컴포넌트
            리렌더링 방지
          </li>
          <li>
            <strong>useRef:</strong> 값 변경 시 리렌더링 없이 값 저장
          </li>
          <li>
            <strong>가상화:</strong> 큰 리스트의 경우 react-window 사용
          </li>
        </ul>
      </div>

      {/* 성능 측정 */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#d4edda",
          border: "1px solid #c3e6cb",
          borderRadius: "4px",
        }}
      >
        <h4>📈 성능 측정 방법</h4>
        <ol>
          <li>React DevTools Profiler 사용</li>
          <li>개발자 도구 Performance 탭</li>
          <li>console.log로 리렌더링 추적</li>
          <li>React.memo, useMemo, useCallback 효과 확인</li>
        </ol>
      </div>
    </div>
  );
};

export default PerformanceDemo;
