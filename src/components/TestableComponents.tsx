import React, { useState, useEffect } from "react";

// 1. 간단한 카운터 컴포넌트 (기본 테스트용)
interface CounterProps {
  initialValue?: number;
  onCountChange?: (count: number) => void;
  label?: string;
}

export const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  onCountChange,
  label = "카운터",
}) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    onCountChange?.(count);
  }, [count, onCountChange]);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(initialValue);

  return (
    <div data-testid="counter">
      <h3>{label}</h3>
      <p data-testid="count-display">현재 값: {count}</p>
      <div>
        <button data-testid="increment-btn" onClick={increment}>
          증가
        </button>
        <button data-testid="decrement-btn" onClick={decrement}>
          감소
        </button>
        <button data-testid="reset-btn" onClick={reset}>
          리셋
        </button>
      </div>
    </div>
  );
};

// 2. 폼 컴포넌트 (폼 테스트용)
interface FormData {
  name: string;
  email: string;
  age: string;
}

interface FormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

export const UserForm: React.FC<FormProps> = ({
  onSubmit,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name || "",
    email: initialData.email || "",
    age: initialData.age || "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름은 필수입니다";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일은 필수입니다";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "유효한 이메일을 입력하세요";
    }

    if (!formData.age.trim()) {
      newErrors.age = "나이는 필수입니다";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      newErrors.age = "유효한 나이를 입력하세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // 에러가 있으면 실시간으로 제거
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  return (
    <form data-testid="user-form" onSubmit={handleSubmit}>
      <h3>사용자 정보 입력</h3>

      <div>
        <label htmlFor="name">이름:</label>
        <input
          id="name"
          data-testid="name-input"
          type="text"
          value={formData.name}
          onChange={handleChange("name")}
        />
        {errors.name && <span data-testid="name-error">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="email">이메일:</label>
        <input
          id="email"
          data-testid="email-input"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
        />
        {errors.email && <span data-testid="email-error">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="age">나이:</label>
        <input
          id="age"
          data-testid="age-input"
          type="number"
          value={formData.age}
          onChange={handleChange("age")}
        />
        {errors.age && <span data-testid="age-error">{errors.age}</span>}
      </div>

      <button data-testid="submit-btn" type="submit">
        제출
      </button>
    </form>
  );
};

// 3. API 호출 컴포넌트 (비동기 테스트용)
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListProps {
  onUserSelect?: (user: User) => void;
}

export const UserList: React.FC<UserListProps> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // 실제 API 호출을 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUsers: User[] = [
        { id: 1, name: "김철수", email: "kim@example.com" },
        { id: 2, name: "이영희", email: "lee@example.com" },
        { id: 3, name: "박민수", email: "park@example.com" },
      ];

      setUsers(mockUsers);
    } catch (err) {
      setError("사용자 목록을 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div data-testid="loading">로딩 중...</div>;
  }

  if (error) {
    return (
      <div data-testid="error">
        <p>{error}</p>
        <button data-testid="retry-btn" onClick={fetchUsers}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div data-testid="user-list">
      <h3>사용자 목록</h3>
      {users.length === 0 ? (
        <p data-testid="no-users">사용자가 없습니다</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              data-testid={`user-item-${user.id}`}
              onClick={() => onUserSelect?.(user)}
              style={{ cursor: "pointer", padding: "5px" }}
            >
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// 4. 조건부 렌더링 컴포넌트 (조건부 테스트용)
interface ConditionalComponentProps {
  isLoggedIn: boolean;
  userRole?: "admin" | "user" | "guest";
  showDetails: boolean;
}

export const ConditionalComponent: React.FC<ConditionalComponentProps> = ({
  isLoggedIn,
  userRole = "guest",
  showDetails,
}) => {
  return (
    <div data-testid="conditional-component">
      {isLoggedIn ? (
        <div data-testid="logged-in-content">
          <h3>환영합니다!</h3>
          {userRole === "admin" && (
            <div data-testid="admin-panel">
              <h4>관리자 패널</h4>
              <p>관리자만 볼 수 있는 내용입니다</p>
            </div>
          )}
          {showDetails && (
            <div data-testid="user-details">
              <p>사용자 역할: {userRole}</p>
              <p>상세 정보가 표시됩니다</p>
            </div>
          )}
        </div>
      ) : (
        <div data-testid="login-prompt">
          <h3>로그인이 필요합니다</h3>
          <p>계속하려면 로그인해주세요</p>
        </div>
      )}
    </div>
  );
};
