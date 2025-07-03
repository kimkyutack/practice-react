import React, { useState } from "react";
import {
  useUser,
  useTheme,
  useNotifications,
  useCart,
} from "../contexts/AppContext";

interface ContextDemoProps {
  title: string;
}

const ContextDemo: React.FC<ContextDemoProps> = ({ title }) => {
  const { user, login, logout } = useUser();
  const { theme, changeTheme, changePrimaryColor } = useTheme();
  const { notifications, addNotification, clearNotifications } =
    useNotifications();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  const [loginName, setLoginName] = useState<string>("");
  const [loginRole, setLoginRole] = useState<"admin" | "user" | "guest">(
    "user"
  );
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [newItemName, setNewItemName] = useState<string>("");
  const [newItemPrice, setNewItemPrice] = useState<string>("");

  // 샘플 상품들
  const sampleProducts = [
    { id: 1, name: "React 책", price: 25000 },
    { id: 2, name: "TypeScript 가이드", price: 30000 },
    { id: 3, name: "개발자 노트북", price: 1500000 },
    { id: 4, name: "커피", price: 4500 },
  ];

  const handleLogin = () => {
    if (loginName.trim()) {
      login(loginName, loginRole);
      addNotification(`${loginName}님이 로그인했습니다!`);
    }
  };

  const handleLogout = () => {
    logout();
    addNotification("로그아웃되었습니다.");
  };

  const handleAddToCart = (product: {
    id: number;
    name: string;
    price: number;
  }) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    addNotification(`${product.name}이(가) 장바구니에 추가되었습니다!`);
  };

  const handleAddCustomItem = () => {
    if (newItemName.trim() && newItemPrice) {
      const price = parseInt(newItemPrice);
      if (!isNaN(price)) {
        addToCart({
          id: Date.now(),
          name: newItemName,
          price: price,
          quantity: 1,
        });
        addNotification(`${newItemName}이(가) 장바구니에 추가되었습니다!`);
        setNewItemName("");
        setNewItemPrice("");
      }
    }
  };

  return (
    <div
      style={{
        border: "2px solid #20c997",
        padding: "20px",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "800px",
        backgroundColor: theme.mode === "dark" ? "#343a40" : "#ffffff",
        color: theme.mode === "dark" ? "#ffffff" : "#000000",
      }}
    >
      <h3 style={{ color: theme.primaryColor }}>{title}</h3>

      {/* 1. 사용자 관리 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>👤 사용자 관리</h4>
        {user.isLoggedIn ? (
          <div>
            <p>
              안녕하세요, <strong>{user.name}</strong>님! ({user.role})
            </p>
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              placeholder="이름을 입력하세요"
              style={{ padding: "8px" }}
            />
            <select
              value={loginRole}
              onChange={(e) =>
                setLoginRole(e.target.value as "admin" | "user" | "guest")
              }
              style={{ padding: "8px" }}
            >
              <option value="guest">게스트</option>
              <option value="user">사용자</option>
              <option value="admin">관리자</option>
            </select>
            <button
              onClick={handleLogin}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              로그인
            </button>
          </div>
        )}
      </div>

      {/* 2. 테마 관리 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>🎨 테마 관리</h4>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={() => changeTheme("light")}
            style={{
              padding: "8px 16px",
              backgroundColor: theme.mode === "light" ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            라이트 모드
          </button>
          <button
            onClick={() => changeTheme("dark")}
            style={{
              padding: "8px 16px",
              backgroundColor: theme.mode === "dark" ? "#007bff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            다크 모드
          </button>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>주요 색상:</span>
          {["#007bff", "#28a745", "#dc3545", "#ffc107", "#6f42c1"].map(
            (color) => (
              <button
                key={color}
                onClick={() => changePrimaryColor(color)}
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: color,
                  border:
                    theme.primaryColor === color
                      ? "3px solid #000"
                      : "1px solid #ccc",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                title={color}
              />
            )
          )}
        </div>
      </div>

      {/* 3. 알림 관리 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>🔔 알림 관리 ({notifications.count})</h4>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder="알림 메시지를 입력하세요"
            style={{ flex: 1, padding: "8px" }}
          />
          <button
            onClick={() => {
              if (notificationMessage.trim()) {
                addNotification(notificationMessage);
                setNotificationMessage("");
              }
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            알림 추가
          </button>
          <button
            onClick={clearNotifications}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            모두 지우기
          </button>
        </div>
        {notifications.messages.length > 0 && (
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {notifications.messages.map((message, index) => (
              <div
                key={index}
                style={{
                  padding: "5px",
                  margin: "2px 0",
                  backgroundColor: "#e9ecef",
                  borderRadius: "4px",
                }}
              >
                {message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. 장바구니 관리 */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        <h4>🛒 장바구니 (총 {cart.total.toLocaleString()}원)</h4>

        {/* 상품 목록 */}
        <div style={{ marginBottom: "15px" }}>
          <h5>상품 목록</h5>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
            }}
          >
            {sampleProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  borderRadius: "4px",
                }}
              >
                <h6>{product.name}</h6>
                <p>{product.price.toLocaleString()}원</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  장바구니에 추가
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 커스텀 상품 추가 */}
        <div style={{ marginBottom: "15px" }}>
          <h5>커스텀 상품 추가</h5>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="상품명"
              style={{ flex: 1, padding: "8px" }}
            />
            <input
              type="number"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              placeholder="가격"
              style={{ width: "100px", padding: "8px" }}
            />
            <button
              onClick={handleAddCustomItem}
              style={{
                padding: "8px 16px",
                backgroundColor: "#fd7e14",
                color: "white",
                border: "none",
                borderRadius: "4px",
              }}
            >
              추가
            </button>
          </div>
        </div>

        {/* 장바구니 내용 */}
        {cart.items.length > 0 ? (
          <div>
            <h5>장바구니 내용</h5>
            {cart.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  margin: "5px 0",
                  borderRadius: "4px",
                }}
              >
                <span>{item.name}</span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span>{item.price.toLocaleString()}원</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value);
                      if (!isNaN(quantity) && quantity >= 0) {
                        updateQuantity(item.id, quantity);
                      }
                    }}
                    style={{ width: "60px", padding: "5px" }}
                    min="0"
                  />
                  <span>{(item.price * item.quantity).toLocaleString()}원</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#6c757d", fontStyle: "italic" }}>
            장바구니가 비어있습니다.
          </p>
        )}
      </div>

      {/* Context 설명 */}
      <div
        style={{
          padding: "15px",
          backgroundColor: "#e7f3ff",
          border: "1px solid #b3d9ff",
          borderRadius: "4px",
        }}
      >
        <h4>💡 Context API의 장점</h4>
        <ul>
          <li>Props Drilling 문제 해결</li>
          <li>전역 상태 관리</li>
          <li>컴포넌트 간 데이터 공유</li>
          <li>TypeScript와 완벽한 통합</li>
          <li>useReducer와 함께 사용하여 복잡한 상태 관리</li>
        </ul>
      </div>
    </div>
  );
};

export default ContextDemo;
