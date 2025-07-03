import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Counter } from "../TestableComponents";

// Counter 컴포넌트 테스트
describe("Counter 컴포넌트", () => {
  // 1. 기본 렌더링 테스트
  test("기본값으로 렌더링된다", () => {
    render(<Counter />);

    expect(screen.getByTestId("counter")).toBeInTheDocument();
    expect(screen.getByTestId("count-display")).toHaveTextContent("현재 값: 0");
    expect(screen.getByText("카운터")).toBeInTheDocument();
  });

  test("초기값이 올바르게 설정된다", () => {
    render(<Counter initialValue={10} />);

    expect(screen.getByTestId("count-display")).toHaveTextContent(
      "현재 값: 10"
    );
  });

  test("커스텀 라벨이 표시된다", () => {
    render(<Counter label="테스트 카운터" />);

    expect(screen.getByText("테스트 카운터")).toBeInTheDocument();
  });

  // 2. 버튼 클릭 테스트
  test("증가 버튼이 올바르게 작동한다", () => {
    render(<Counter />);

    const incrementButton = screen.getByTestId("increment-btn");
    const countDisplay = screen.getByTestId("count-display");

    expect(countDisplay).toHaveTextContent("현재 값: 0");

    fireEvent.click(incrementButton);
    expect(countDisplay).toHaveTextContent("현재 값: 1");

    fireEvent.click(incrementButton);
    expect(countDisplay).toHaveTextContent("현재 값: 2");
  });

  test("감소 버튼이 올바르게 작동한다", () => {
    render(<Counter initialValue={5} />);

    const decrementButton = screen.getByTestId("decrement-btn");
    const countDisplay = screen.getByTestId("count-display");

    expect(countDisplay).toHaveTextContent("현재 값: 5");

    fireEvent.click(decrementButton);
    expect(countDisplay).toHaveTextContent("현재 값: 4");

    fireEvent.click(decrementButton);
    expect(countDisplay).toHaveTextContent("현재 값: 3");
  });

  test("리셋 버튼이 올바르게 작동한다", () => {
    render(<Counter initialValue={10} />);

    const incrementButton = screen.getByTestId("increment-btn");
    const resetButton = screen.getByTestId("reset-btn");
    const countDisplay = screen.getByTestId("count-display");

    // 먼저 값을 증가시킴
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(countDisplay).toHaveTextContent("현재 값: 12");

    // 리셋 버튼 클릭
    fireEvent.click(resetButton);
    expect(countDisplay).toHaveTextContent("현재 값: 10");
  });

  // 3. 콜백 함수 테스트
  test("onCountChange 콜백이 올바르게 호출된다", () => {
    const mockOnCountChange = jest.fn();
    render(<Counter onCountChange={mockOnCountChange} />);

    const incrementButton = screen.getByTestId("increment-btn");

    // 초기값 0으로 콜백 호출
    expect(mockOnCountChange).toHaveBeenCalledWith(0);

    // 증가 버튼 클릭
    fireEvent.click(incrementButton);
    expect(mockOnCountChange).toHaveBeenCalledWith(1);

    // 총 2번 호출됨 (초기값 + 증가)
    expect(mockOnCountChange).toHaveBeenCalledTimes(2);
  });

  // 4. 통합 테스트
  test("모든 버튼이 함께 올바르게 작동한다", () => {
    const mockOnCountChange = jest.fn();
    render(<Counter initialValue={5} onCountChange={mockOnCountChange} />);

    const incrementButton = screen.getByTestId("increment-btn");
    const decrementButton = screen.getByTestId("decrement-btn");
    const resetButton = screen.getByTestId("reset-btn");
    const countDisplay = screen.getByTestId("count-display");

    // 초기 상태 확인
    expect(countDisplay).toHaveTextContent("현재 값: 5");

    // 증가
    fireEvent.click(incrementButton);
    expect(countDisplay).toHaveTextContent("현재 값: 6");

    // 감소
    fireEvent.click(decrementButton);
    expect(countDisplay).toHaveTextContent("현재 값: 5");

    // 다시 증가
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(countDisplay).toHaveTextContent("현재 값: 7");

    // 리셋
    fireEvent.click(resetButton);
    expect(countDisplay).toHaveTextContent("현재 값: 5");

    // 콜백 호출 확인
    expect(mockOnCountChange).toHaveBeenCalledWith(5); // 초기값
    expect(mockOnCountChange).toHaveBeenCalledWith(6); // 증가 후
    expect(mockOnCountChange).toHaveBeenCalledWith(5); // 감소 후
    expect(mockOnCountChange).toHaveBeenCalledWith(7); // 2번 증가 후
    expect(mockOnCountChange).toHaveBeenCalledWith(5); // 리셋 후
  });

  // 5. 접근성 테스트
  test("모든 버튼이 접근 가능하다", () => {
    render(<Counter />);

    expect(screen.getByTestId("increment-btn")).toBeEnabled();
    expect(screen.getByTestId("decrement-btn")).toBeEnabled();
    expect(screen.getByTestId("reset-btn")).toBeEnabled();
  });

  test("버튼들이 키보드로 접근 가능하다", () => {
    render(<Counter />);

    const incrementButton = screen.getByTestId("increment-btn");
    const decrementButton = screen.getByTestId("decrement-btn");
    const resetButton = screen.getByTestId("reset-btn");

    // Tab 키로 포커스 이동
    incrementButton.focus();
    expect(incrementButton).toHaveFocus();

    decrementButton.focus();
    expect(decrementButton).toHaveFocus();

    resetButton.focus();
    expect(resetButton).toHaveFocus();
  });
});
