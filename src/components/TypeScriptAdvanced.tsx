import React, { useState } from "react";

// 1. 제네릭 타입 정의
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// 2. 유니온 타입과 타입 가드
type Status = "loading" | "success" | "error" | "idle";

type Shape =
  | { type: "circle"; radius: number }
  | { type: "rectangle"; width: number; height: number }
  | { type: "square"; side: number };

// 타입 가드 함수들
function isCircle(shape: Shape): shape is { type: "circle"; radius: number } {
  return shape.type === "circle";
}

function isRectangle(
  shape: Shape
): shape is { type: "rectangle"; width: number; height: number } {
  return shape.type === "rectangle";
}

function isSquare(shape: Shape): shape is { type: "square"; side: number } {
  return shape.type === "square";
}

// 3. 조건부 타입
type NonNullable<T> = T extends null | undefined ? never : T;
type ArrayElement<T> = T extends Array<infer U> ? U : never;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 4. 매핑된 타입
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 5. 유틸리티 타입을 활용한 고급 타입
type UserFormData = Partial<User>;
type UserResponse = ApiResponse<User>;
type ProductResponse = ApiResponse<Product>;

// 6. 제네릭 함수들
function createApiResponse<T>(
  data: T,
  status: number = 200,
  message: string = "Success"
): ApiResponse<T> {
  return { data, status, message };
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 7. 고급 컴포넌트 props 타입
interface AdvancedComponentProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  onItemClick?: (item: T) => void;
}

// 제네릭 컴포넌트
function AdvancedList<T>({
  data,
  renderItem,
  keyExtractor,
  onItemClick,
}: AdvancedComponentProps<T>) {
  return (
    <div>
      {data.map((item, index) => (
        <div key={keyExtractor(item)} onClick={() => onItemClick?.(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// 8. 메인 데모 컴포넌트
interface TypeScriptAdvancedProps {
  title: string;
}

const TypeScriptAdvanced: React.FC<TypeScriptAdvancedProps> = ({ title }) => {
  const [status, setStatus] = useState<Status>("idle");
  const [selectedShape, setSelectedShape] = useState<Shape>({
    type: "circle",
    radius: 5,
  });
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "김철수", email: "kim@example.com", role: "admin" },
    { id: 2, name: "이영희", email: "lee@example.com", role: "user" },
    { id: 3, name: "박민수", email: "park@example.com", role: "guest" },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "노트북", price: 1500000, category: "전자제품" },
    { id: 2, name: "마우스", price: 50000, category: "액세서리" },
    { id: 3, name: "키보드", price: 100000, category: "액세서리" },
  ]);

  // 제네릭 함수 사용 예제
  const userResponse: UserResponse = createApiResponse(
    users[0],
    200,
    "User found"
  );
  const productResponse: ProductResponse = createApiResponse(
    products[0],
    200,
    "Product found"
  );

  // 타입 가드를 사용한 함수
  const calculateArea = (shape: Shape): number => {
    if (isCircle(shape)) {
      return Math.PI * shape.radius ** 2;
    } else if (isRectangle(shape)) {
      return shape.width * shape.height;
    } else if (isSquare(shape)) {
      return shape.side ** 2;
    }
    return 0;
  };

  // 조건부 렌더링을 위한 타입 가드
  const renderShapeInfo = (shape: Shape) => {
    if (isCircle(shape)) {
      return <span>원 (반지름: {shape.radius})</span>;
    } else if (isRectangle(shape)) {
      return (
        <span>
          직사각형 ({shape.width} x {shape.height})
        </span>
      );
    } else if (isSquare(shape)) {
      return <span>정사각형 (한 변: {shape.side})</span>;
    }
    return <span>알 수 없는 도형</span>;
  };

  return (
    <div
      style={{
        border: "2px solid #6f42c1",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "900px",
      }}
    >
      <h3>{title}</h3>

      {/* 1. 제네릭 타입 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>🔧 제네릭 타입</h4>
        <p>
          제네릭을 사용하여 타입 안전성을 보장하면서 재사용 가능한 타입을 만들
          수 있습니다.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h5>User Response:</h5>
            <pre
              style={{
                backgroundColor: "#e9ecef",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {JSON.stringify(userResponse, null, 2)}
            </pre>
          </div>
          <div>
            <h5>Product Response:</h5>
            <pre
              style={{
                backgroundColor: "#e9ecef",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {JSON.stringify(productResponse, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* 2. 유니온 타입과 타입 가드 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>🔄 유니온 타입과 타입 가드</h4>
        <p>타입 가드를 사용하여 런타임에 타입을 안전하게 확인할 수 있습니다.</p>

        <div style={{ marginBottom: "10px" }}>
          <label>도형 선택:</label>
          <select
            value={selectedShape.type}
            onChange={(e) => {
              const type = e.target.value as Shape["type"];
              switch (type) {
                case "circle":
                  setSelectedShape({ type: "circle", radius: 5 });
                  break;
                case "rectangle":
                  setSelectedShape({ type: "rectangle", width: 10, height: 5 });
                  break;
                case "square":
                  setSelectedShape({ type: "square", side: 7 });
                  break;
              }
            }}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="circle">원</option>
            <option value="rectangle">직사각형</option>
            <option value="square">정사각형</option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <strong>선택된 도형:</strong> {renderShapeInfo(selectedShape)}
          </div>
          <div>
            <strong>면적:</strong> {calculateArea(selectedShape).toFixed(2)}
          </div>
        </div>
      </div>

      {/* 3. 조건부 타입 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>🎯 조건부 타입</h4>
        <p>조건에 따라 타입을 동적으로 결정할 수 있습니다.</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h5>Nullable 타입 처리:</h5>
            <pre
              style={{
                backgroundColor: "#e9ecef",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {`type StringOrNull = string | null;
type NonNullString = NonNullable<StringOrNull>; // string`}
            </pre>
          </div>
          <div>
            <h5>배열 요소 타입 추출:</h5>
            <pre
              style={{
                backgroundColor: "#e9ecef",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {`type NumberArray = number[];
type NumberElement = ArrayElement<NumberArray>; // number`}
            </pre>
          </div>
        </div>
      </div>

      {/* 4. 매핑된 타입 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>🗺️ 매핑된 타입</h4>
        <p>기존 타입을 기반으로 새로운 타입을 생성할 수 있습니다.</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h5>Partial&lt;User&gt; (모든 속성이 선택적):</h5>
            <pre
              style={{
                backgroundColor: "#e9ecef",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {`{
  id?: number;
  name?: string;
  email?: string;
  role?: 'admin' | 'user' | 'guest';
}`}
            </pre>
          </div>
          <div>
            <h5>Required&lt;User&gt; (모든 속성이 필수):</h5>
            <pre
              style={{
                backgroundColor: "#e9ecef",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {`{
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* 5. 제네릭 컴포넌트 데모 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>⚛️ 제네릭 컴포넌트</h4>
        <p>
          제네릭을 사용하여 다양한 타입의 데이터를 처리할 수 있는 컴포넌트를
          만들 수 있습니다.
        </p>

        <div style={{ marginBottom: "15px" }}>
          <h5>사용자 목록:</h5>
          <AdvancedList
            data={users}
            keyExtractor={(user) => user.id}
            renderItem={(user) => (
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  margin: "5px 0",
                  borderRadius: "4px",
                }}
              >
                <strong>{user.name}</strong> ({user.email}) - {user.role}
              </div>
            )}
            onItemClick={(user) => alert(`${user.name} 클릭됨!`)}
          />
        </div>

        <div>
          <h5>상품 목록:</h5>
          <AdvancedList
            data={products}
            keyExtractor={(product) => product.id}
            renderItem={(product) => (
              <div
                style={{
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  margin: "5px 0",
                  borderRadius: "4px",
                }}
              >
                <strong>{product.name}</strong> -{" "}
                {product.price.toLocaleString()}원 ({product.category})
              </div>
            )}
            onItemClick={(product) => alert(`${product.name} 클릭됨!`)}
          />
        </div>
      </div>

      {/* 6. 고급 타입 활용 예제 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>🚀 고급 타입 활용</h4>
        <p>
          여러 고급 타입 기능을 조합하여 강력한 타입 시스템을 구축할 수
          있습니다.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <div>
            <h5>타입 안전한 이벤트 핸들러:</h5>
            <pre
              style={{
                backgroundColor: "#e9ecef",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {`type EventHandler<T> = (event: T) => void;
type ClickHandler = EventHandler<React.MouseEvent>;
type ChangeHandler = EventHandler<React.ChangeEvent<HTMLInputElement>>;`}
            </pre>
          </div>
          <div>
            <h5>조건부 렌더링 타입:</h5>
            <pre
              style={{
                backgroundColor: "#e9ecef",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              {`type ConditionalRender<T> = T extends true 
  ? React.ReactNode 
  : never;

type ShowIfLoggedIn = ConditionalRender<true>;`}
            </pre>
          </div>
        </div>
      </div>

      {/* TypeScript 고급 기능 설명 */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#e7f3ff",
          border: "1px solid #b3d9ff",
          borderRadius: "4px",
        }}
      >
        <h4>💡 TypeScript 고급 기능의 장점</h4>
        <ul>
          <li>
            <strong>타입 안전성:</strong> 컴파일 타임에 오류 발견
          </li>
          <li>
            <strong>코드 가독성:</strong> 명확한 타입 정의로 코드 이해도 향상
          </li>
          <li>
            <strong>개발자 경험:</strong> IDE 자동완성과 리팩토링 지원
          </li>
          <li>
            <strong>유지보수성:</strong> 타입 변경 시 영향 범위 자동 감지
          </li>
          <li>
            <strong>재사용성:</strong> 제네릭을 통한 범용적인 타입 정의
          </li>
        </ul>
      </div>

      {/* 실전 활용 팁 */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
        }}
      >
        <h4>🎯 실전 활용 팁</h4>
        <ol>
          <li>제네릭은 재사용 가능한 컴포넌트나 함수에 적극 활용</li>
          <li>타입 가드는 런타임 타입 검증에 필수</li>
          <li>조건부 타입으로 복잡한 타입 로직 구현</li>
          <li>매핑된 타입으로 기존 타입 변형</li>
          <li>유니온 타입으로 다양한 상태 표현</li>
        </ol>
      </div>
    </div>
  );
};

export default TypeScriptAdvanced;
