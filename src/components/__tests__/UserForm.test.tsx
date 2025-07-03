import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserForm } from "../TestableComponents";

// UserForm 컴포넌트 테스트
describe("UserForm 컴포넌트", () => {
  // 1. 기본 렌더링 테스트
  test("폼이 올바르게 렌더링된다", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    expect(screen.getByTestId("user-form")).toBeInTheDocument();
    expect(screen.getByText("사용자 정보 입력")).toBeInTheDocument();
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("age-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  test("초기 데이터가 올바르게 설정된다", () => {
    const initialData = {
      name: "김철수",
      email: "kim@example.com",
      age: "25",
    };

    render(<UserForm onSubmit={jest.fn()} initialData={initialData} />);

    expect(screen.getByTestId("name-input")).toHaveValue("김철수");
    expect(screen.getByTestId("email-input")).toHaveValue("kim@example.com");
    expect(screen.getByTestId("age-input")).toHaveValue(25);
  });

  // 2. 입력 필드 테스트
  test("입력 필드에 값을 입력할 수 있다", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");
    const ageInput = screen.getByTestId("age-input");

    fireEvent.change(nameInput, { target: { value: "김철수" } });
    fireEvent.change(emailInput, { target: { value: "kim@example.com" } });
    fireEvent.change(ageInput, { target: { value: "25" } });

    expect(nameInput).toHaveValue("김철수");
    expect(emailInput).toHaveValue("kim@example.com");
    expect(ageInput).toHaveValue(25);
  });

  // 3. 유효성 검사 테스트
  test("빈 필드에 대한 유효성 검사가 작동한다", async () => {
    const mockOnSubmit = jest.fn();
    render(<UserForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByTestId("submit-btn");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("name-error")).toHaveTextContent(
        "이름은 필수입니다"
      );
    });
    expect(screen.getByTestId("email-error")).toHaveTextContent(
      "이메일은 필수입니다"
    );
    expect(screen.getByTestId("age-error")).toHaveTextContent(
      "나이는 필수입니다"
    );

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("잘못된 이메일 형식에 대한 유효성 검사가 작동한다", async () => {
    const mockOnSubmit = jest.fn();
    render(<UserForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByTestId("email-input");
    const submitButton = screen.getByTestId("submit-btn");

    // 잘못된 이메일 입력
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("email-error")).toHaveTextContent(
        "유효한 이메일을 입력하세요"
      );
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("잘못된 나이에 대한 유효성 검사가 작동한다", async () => {
    const mockOnSubmit = jest.fn();
    render(<UserForm onSubmit={mockOnSubmit} />);

    const ageInput = screen.getByTestId("age-input");
    const submitButton = screen.getByTestId("submit-btn");

    // 음수 나이 입력
    fireEvent.change(ageInput, { target: { value: "-5" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("age-error")).toHaveTextContent(
        "유효한 나이를 입력하세요"
      );
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // 4. 성공적인 제출 테스트
  test("유효한 데이터로 폼이 성공적으로 제출된다", async () => {
    const mockOnSubmit = jest.fn();
    render(<UserForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");
    const ageInput = screen.getByTestId("age-input");
    const submitButton = screen.getByTestId("submit-btn");

    // 유효한 데이터 입력
    fireEvent.change(nameInput, { target: { value: "김철수" } });
    fireEvent.change(emailInput, { target: { value: "kim@example.com" } });
    fireEvent.change(ageInput, { target: { value: "25" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "김철수",
        email: "kim@example.com",
        age: "25",
      });
    });
  });

  // 5. 실시간 에러 제거 테스트
  test("입력 시 에러가 실시간으로 제거된다", async () => {
    const mockOnSubmit = jest.fn();
    render(<UserForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByTestId("name-input");
    const submitButton = screen.getByTestId("submit-btn");

    // 빈 필드로 제출하여 에러 생성
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("name-error")).toBeInTheDocument();
    });

    // 이름 입력하여 에러 제거
    fireEvent.change(nameInput, { target: { value: "김철수" } });

    await waitFor(() => {
      expect(screen.queryByTestId("name-error")).not.toBeInTheDocument();
    });
  });

  // 6. 접근성 테스트
  test("라벨과 입력 필드가 올바르게 연결된다", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");
    const ageInput = screen.getByTestId("age-input");

    expect(nameInput).toHaveAttribute("id", "name");
    expect(emailInput).toHaveAttribute("id", "email");
    expect(ageInput).toHaveAttribute("id", "age");

    expect(screen.getByLabelText("이름:")).toBe(nameInput);
    expect(screen.getByLabelText("이메일:")).toBe(emailInput);
    expect(screen.getByLabelText("나이:")).toBe(ageInput);
  });

  test("키보드로 폼을 사용할 수 있다", () => {
    render(<UserForm onSubmit={jest.fn()} />);

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");
    const ageInput = screen.getByTestId("age-input");
    const submitButton = screen.getByTestId("submit-btn");

    // Tab 키로 포커스 이동
    nameInput.focus();
    expect(nameInput).toHaveFocus();

    emailInput.focus();
    expect(emailInput).toHaveFocus();

    ageInput.focus();
    expect(ageInput).toHaveFocus();

    submitButton.focus();
    expect(submitButton).toHaveFocus();
  });

  // 7. 엣지 케이스 테스트
  test("공백만 있는 이름은 유효하지 않다", async () => {
    const mockOnSubmit = jest.fn();
    render(<UserForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByTestId("name-input");
    const submitButton = screen.getByTestId("submit-btn");

    fireEvent.change(nameInput, { target: { value: "   " } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("name-error")).toHaveTextContent(
        "이름은 필수입니다"
      );
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test("0세는 유효한 나이이다", async () => {
    const mockOnSubmit = jest.fn();
    render(<UserForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");
    const ageInput = screen.getByTestId("age-input");
    const submitButton = screen.getByTestId("submit-btn");

    fireEvent.change(nameInput, { target: { value: "김철수" } });
    fireEvent.change(emailInput, { target: { value: "kim@example.com" } });
    fireEvent.change(ageInput, { target: { value: "0" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "김철수",
        email: "kim@example.com",
        age: "0",
      });
    });
  });
});
