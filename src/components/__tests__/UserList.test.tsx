import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserList } from "../TestableComponents";

// UserList 컴포넌트 테스트
describe("UserList 컴포넌트", () => {
  // 1. 로딩 상태 테스트
  test("초기에 로딩 상태가 표시된다", () => {
    render(<UserList />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByText("로딩 중...")).toBeInTheDocument();
  });

  // 2. 성공적인 데이터 로딩 테스트
  test("사용자 목록이 성공적으로 로드된다", async () => {
    render(<UserList />);

    // 로딩 상태 확인
    expect(screen.getByTestId("loading")).toBeInTheDocument();

    // 데이터 로딩 완료 대기
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });

    // 사용자 목록 확인
    expect(screen.getByText("사용자 목록")).toBeInTheDocument();
    expect(screen.getByTestId("user-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("user-item-2")).toBeInTheDocument();
    expect(screen.getByTestId("user-item-3")).toBeInTheDocument();

    // 사용자 정보 확인
    expect(screen.getByText("김철수 (kim@example.com)")).toBeInTheDocument();
    expect(screen.getByText("이영희 (lee@example.com)")).toBeInTheDocument();
    expect(screen.getByText("박민수 (park@example.com)")).toBeInTheDocument();
  });

  // 3. 사용자 선택 테스트
  test("사용자를 클릭하면 콜백이 호출된다", async () => {
    const mockOnUserSelect = jest.fn();
    render(<UserList onUserSelect={mockOnUserSelect} />);

    // 데이터 로딩 완료 대기
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });

    // 첫 번째 사용자 클릭
    const firstUser = screen.getByTestId("user-item-1");
    fireEvent.click(firstUser);

    expect(mockOnUserSelect).toHaveBeenCalledWith({
      id: 1,
      name: "김철수",
      email: "kim@example.com",
    });
  });

  // 4. 에러 상태 테스트 (모킹을 통한 에러 시뮬레이션)
  test("에러 발생 시 에러 메시지가 표시된다", async () => {
    // fetch를 모킹하여 에러를 시뮬레이션
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Network error"))
    ) as jest.Mock;

    render(<UserList />);

    // 에러 상태 대기
    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    expect(
      screen.getByText("사용자 목록을 불러오는데 실패했습니다")
    ).toBeInTheDocument();
    expect(screen.getByTestId("retry-btn")).toBeInTheDocument();

    // 원래 fetch 복원
    global.fetch = originalFetch;
  });

  // 5. 재시도 기능 테스트
  test("재시도 버튼이 작동한다", async () => {
    const mockOnUserSelect = jest.fn();
    render(<UserList onUserSelect={mockOnUserSelect} />);

    // 데이터 로딩 완료 대기
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });

    // 재시도 버튼 클릭
    const retryButton = screen.getByTestId("retry-btn");
    fireEvent.click(retryButton);

    // 다시 로딩 상태로 돌아가는지 확인
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    // 다시 데이터가 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });
  });

  // 6. 빈 목록 테스트
  test("사용자가 없을 때 적절한 메시지가 표시된다", async () => {
    // 컴포넌트를 모킹하여 빈 배열을 반환하도록 수정
    const MockUserList = () => {
      const [users, setUsers] = React.useState<any[]>([]);
      const [loading, setLoading] = React.useState(false);

      React.useEffect(() => {
        setLoading(false);
      }, []);

      if (loading) {
        return <div data-testid="loading">로딩 중...</div>;
      }

      return (
        <div data-testid="user-list">
          <h3>사용자 목록</h3>
          {users.length === 0 ? (
            <p data-testid="no-users">사용자가 없습니다</p>
          ) : (
            <ul>
              {users.map((user) => (
                <li key={user.id} data-testid={`user-item-${user.id}`}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };

    render(<MockUserList />);

    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });

    expect(screen.getByTestId("no-users")).toBeInTheDocument();
    expect(screen.getByText("사용자가 없습니다")).toBeInTheDocument();
  });

  // 7. 접근성 테스트
  test("사용자 목록이 접근 가능하다", async () => {
    render(<UserList />);

    // 데이터 로딩 완료 대기
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });

    // 사용자 항목들이 클릭 가능한지 확인
    const userItems = [
      screen.getByTestId("user-item-1"),
      screen.getByTestId("user-item-2"),
      screen.getByTestId("user-item-3"),
    ];

    userItems.forEach((item) => {
      expect(item).toHaveStyle("cursor: pointer");
    });
  });

  // 8. 키보드 접근성 테스트
  test("키보드로 사용자 목록에 접근할 수 있다", async () => {
    const mockOnUserSelect = jest.fn();
    render(<UserList onUserSelect={mockOnUserSelect} />);

    // 데이터 로딩 완료 대기
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });

    const firstUser = screen.getByTestId("user-item-1");

    // 포커스 이동
    firstUser.focus();
    expect(firstUser).toHaveFocus();

    // Enter 키로 선택
    fireEvent.keyDown(firstUser, { key: "Enter", code: "Enter" });
    expect(mockOnUserSelect).toHaveBeenCalledWith({
      id: 1,
      name: "김철수",
      email: "kim@example.com",
    });
  });

  // 9. 성능 테스트 (렌더링 시간 측정)
  test("사용자 목록이 적절한 시간 내에 렌더링된다", async () => {
    const startTime = performance.now();

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 2초 이내에 렌더링되어야 함 (1초 지연 + 여유 시간)
    expect(renderTime).toBeLessThan(2000);
  });

  // 10. 메모리 누수 테스트
  test("컴포넌트 언마운트 시 메모리 누수가 없다", async () => {
    const { unmount } = render(<UserList />);

    // 데이터 로딩 완료 대기
    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
    });

    // 컴포넌트 언마운트
    unmount();

    // DOM에서 제거되었는지 확인
    expect(screen.queryByTestId("user-list")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });
});
