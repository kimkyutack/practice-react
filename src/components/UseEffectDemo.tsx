import React, { useState, useEffect, useRef } from "react";

interface UseEffectDemoProps {
  title: string;
}

const UseEffectDemo: React.FC<UseEffectDemoProps> = ({ title }) => {
  const [count, setCount] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. 컴포넌트 마운트 시 한 번만 실행 (빈 의존성 배열)
  useEffect(() => {
    console.log("컴포넌트가 마운트되었습니다!");

    // 컴포넌트 언마운트 시 정리 함수
    return () => {
      console.log("컴포넌트가 언마운트됩니다!");
    };
  }, []);

  // 2. count가 변경될 때마다 실행
  useEffect(() => {
    console.log(`카운트가 ${count}로 변경되었습니다!`);

    // 브라우저 타이틀 업데이트
    document.title = `카운트: ${count}`;
  }, [count]);

  // 3. name이 변경될 때마다 실행 (디바운싱)
  useEffect(() => {
    if (name.trim() === "") return;

    const timeoutId = setTimeout(() => {
      console.log(`사용자 이름: ${name}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [name]);

  // 4. 윈도우 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("mounted");
    return () => {
      console.log("unmounted");
    };
  }, []);
  // 5. 온라인/오프라인 상태 감지
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 6. 자동 카운터 (인터벌)
  useEffect(() => {
    if (count > 0) {
      intervalRef.current = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [count]);

  // 7. API 호출 시뮬레이션
  const fetchData = async () => {
    setLoading(true);
    try {
      // 실제 API 호출을 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockData = [
        { id: 1, name: "아이템 1" },
        { id: 2, name: "아이템 2" },
        { id: 3, name: "아이템 3" },
      ];
      setData(mockData);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <div
      style={{
        border: "2px solid #fd7e14",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "600px",
      }}
    >
      <h3>{title}</h3>

      {/* 1. 기본 카운터 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>1. 기본 카운터 (useEffect로 타이틀 업데이트)</h4>
        <p>현재 카운트: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          style={{ marginRight: "10px", padding: "8px 16px" }}
        >
          증가
        </button>
        <button onClick={() => setCount(10)} style={{ padding: "8px 16px" }}>
          10으로 설정 (자동 카운트다운)
        </button>
      </div>

      {/* 2. 이름 입력 (디바운싱) */}
      <div style={{ marginBottom: "20px" }}>
        <h4>2. 이름 입력 (디바운싱)</h4>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요 (500ms 후 콘솔에 출력)"
          style={{ width: "100%", padding: "8px" }}
        />
        <p>입력된 이름: {name || "(없음)"}</p>
      </div>

      {/* 3. 윈도우 크기 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>3. 윈도우 크기 감지</h4>
        <p>
          윈도우 크기: {windowSize.width} x {windowSize.height}
        </p>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "4px",
          }}
        >
          <p>브라우저 창의 크기를 조절해보세요!</p>
        </div>
      </div>

      {/* 4. 온라인 상태 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>4. 온라인/오프라인 상태</h4>
        <div
          style={{
            padding: "10px",
            backgroundColor: isOnline ? "#d4edda" : "#f8d7da",
            color: isOnline ? "#155724" : "#721c24",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          {isOnline ? "🟢 온라인" : "🔴 오프라인"}
        </div>
        <p>네트워크 연결을 끊어보세요 (개발자 도구 → Network → Offline)</p>
      </div>

      {/* 5. API 데이터 로딩 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>5. API 데이터 로딩 시뮬레이션</h4>
        {loading ? (
          <p>데이터 로딩 중...</p>
        ) : (
          <div>
            <button
              onClick={fetchData}
              style={{ marginBottom: "10px", padding: "8px 16px" }}
            >
              데이터 다시 로드
            </button>
            <ul>
              {data.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* useEffect 설명 */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#e7f3ff",
          border: "1px solid #b3d9ff",
          borderRadius: "4px",
        }}
      >
        <h4>💡 useEffect 사용법</h4>
        <ul>
          <li>
            <code>useEffect(() =&gt; &#123;&#125;, [])</code> - 마운트 시 한
            번만
          </li>
          <li>
            <code>useEffect(() =&gt; &#123;&#125;, [count])</code> - count 변경
            시
          </li>
          <li>
            <code>useEffect(() =&gt; &#123;&#125;)</code> - 모든 렌더링 시
          </li>
          <li>return 함수로 정리(cleanup) 작업</li>
        </ul>
      </div>

      {/* 콘솔 로그 확인 안내 */}
      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
        }}
      >
        <p>
          <strong>
            💻 개발자 도구의 콘솔을 열어서 useEffect 로그를 확인해보세요!
          </strong>
        </p>
      </div>
    </div>
  );
};

export default UseEffectDemo;
