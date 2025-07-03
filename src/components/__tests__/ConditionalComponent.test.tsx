import React from "react";
import { render, screen } from "@testing-library/react";
import { ConditionalComponent } from "../TestableComponents";

// ConditionalComponent 테스트
describe("ConditionalComponent", () => {
  // 1. 로그인하지 않은 상태 테스트
  test("로그인하지 않은 상태에서 로그인 프롬프트가 표시된다", () => {
    render(<ConditionalComponent isLoggedIn={false} showDetails={false} />);

    expect(screen.getByTestId("conditional-component")).toBeInTheDocument();
    expect(screen.getByTestId("login-prompt")).toBeInTheDocument();
    expect(screen.getByText("로그인이 필요합니다")).toBeInTheDocument();
    expect(screen.getByText("계속하려면 로그인해주세요")).toBeInTheDocument();

    // 로그인된 콘텐츠는 표시되지 않아야 함
    expect(screen.queryByTestId("logged-in-content")).not.toBeInTheDocument();
  });

  // 2. 로그인된 상태 테스트
  test("로그인된 상태에서 환영 메시지가 표시된다", () => {
    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="user"
        showDetails={false}
      />
    );

    expect(screen.getByTestId("conditional-component")).toBeInTheDocument();
    expect(screen.getByTestId("logged-in-content")).toBeInTheDocument();
    expect(screen.getByText("환영합니다!")).toBeInTheDocument();

    // 로그인 프롬프트는 표시되지 않아야 함
    expect(screen.queryByTestId("login-prompt")).not.toBeInTheDocument();
  });

  // 3. 관리자 패널 테스트
  test("관리자 역할일 때 관리자 패널이 표시된다", () => {
    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="admin"
        showDetails={false}
      />
    );

    expect(screen.getByTestId("admin-panel")).toBeInTheDocument();
    expect(screen.getByText("관리자 패널")).toBeInTheDocument();
    expect(
      screen.getByText("관리자만 볼 수 있는 내용입니다")
    ).toBeInTheDocument();
  });

  test("일반 사용자 역할일 때 관리자 패널이 표시되지 않는다", () => {
    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="user"
        showDetails={false}
      />
    );

    expect(screen.queryByTestId("admin-panel")).not.toBeInTheDocument();
  });

  test("게스트 역할일 때 관리자 패널이 표시되지 않는다", () => {
    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="guest"
        showDetails={false}
      />
    );

    expect(screen.queryByTestId("admin-panel")).not.toBeInTheDocument();
  });

  // 4. 상세 정보 표시 테스트
  test("showDetails가 true일 때 상세 정보가 표시된다", () => {
    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="user"
        showDetails={true}
      />
    );

    expect(screen.getByTestId("user-details")).toBeInTheDocument();
    expect(screen.getByText("사용자 역할: user")).toBeInTheDocument();
    expect(screen.getByText("상세 정보가 표시됩니다")).toBeInTheDocument();
  });

  test("showDetails가 false일 때 상세 정보가 표시되지 않는다", () => {
    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="user"
        showDetails={false}
      />
    );

    expect(screen.queryByTestId("user-details")).not.toBeInTheDocument();
  });

  // 5. 복합 조건 테스트
  test("관리자이면서 상세 정보가 표시되는 경우", () => {
    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="admin"
        showDetails={true}
      />
    );

    // 로그인된 콘텐츠
    expect(screen.getByTestId("logged-in-content")).toBeInTheDocument();
    expect(screen.getByText("환영합니다!")).toBeInTheDocument();

    // 관리자 패널
    expect(screen.getByTestId("admin-panel")).toBeInTheDocument();
    expect(screen.getByText("관리자 패널")).toBeInTheDocument();

    // 상세 정보
    expect(screen.getByTestId("user-details")).toBeInTheDocument();
    expect(screen.getByText("사용자 역할: admin")).toBeInTheDocument();
  });

  // 6. 기본값 테스트
  test("userRole이 제공되지 않으면 guest로 기본값이 설정된다", () => {
    render(<ConditionalComponent isLoggedIn={true} showDetails={true} />);

    expect(screen.getByText("사용자 역할: guest")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-panel")).not.toBeInTheDocument();
  });

  // 7. 접근성 테스트
  test("모든 텍스트가 스크린 리더에서 접근 가능하다", () => {
    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="admin"
        showDetails={true}
      />
    );

    // 모든 중요한 텍스트가 존재하는지 확인
    expect(screen.getByText("환영합니다!")).toBeInTheDocument();
    expect(screen.getByText("관리자 패널")).toBeInTheDocument();
    expect(
      screen.getByText("관리자만 볼 수 있는 내용입니다")
    ).toBeInTheDocument();
    expect(screen.getByText("사용자 역할: admin")).toBeInTheDocument();
    expect(screen.getByText("상세 정보가 표시됩니다")).toBeInTheDocument();
  });

  // 8. 스냅샷 테스트
  test("로그인하지 않은 상태의 스냅샷이 일치한다", () => {
    const { container } = render(
      <ConditionalComponent isLoggedIn={false} showDetails={false} />
    );

    expect(container).toMatchSnapshot();
  });

  test("관리자 로그인 상태의 스냅샷이 일치한다", () => {
    const { container } = render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="admin"
        showDetails={true}
      />
    );

    expect(container).toMatchSnapshot();
  });

  // 9. 엣지 케이스 테스트
  test("빈 문자열 userRole이 제공되면 guest로 처리된다", () => {
    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole={"" as any}
        showDetails={true}
      />
    );

    expect(screen.getByText("사용자 역할: ")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-panel")).not.toBeInTheDocument();
  });

  // 10. 성능 테스트
  test("조건부 렌더링이 빠르게 작동한다", () => {
    const startTime = performance.now();

    render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="admin"
        showDetails={true}
      />
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // 100ms 이내에 렌더링되어야 함
    expect(renderTime).toBeLessThan(100);
  });

  // 11. 메모리 사용량 테스트
  test("조건부 렌더링이 메모리 효율적으로 작동한다", () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

    const { unmount } = render(
      <ConditionalComponent
        isLoggedIn={true}
        userRole="admin"
        showDetails={true}
      />
    );

    unmount();

    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // 메모리 증가가 합리적인 범위 내에 있어야 함 (1MB 이하)
    expect(memoryIncrease).toBeLessThan(1024 * 1024);
  });
});
