import React, { useState } from "react";

interface OrderAppProps {
  sharedState: {
    user: {
      id: string;
      name: string;
      role: string;
    } | null;
    theme: "light" | "dark";
    language: "ko" | "en";
  };
  onSharedStateChange: (key: string, value: any) => void;
  onError: (error: Error) => void;
}

const OrderApp: React.FC<OrderAppProps> = ({
  sharedState,
  onSharedStateChange,
  onError,
}) => {
  const [orders, setOrders] = useState([
    {
      id: "1",
      customerName: "김철수",
      products: ["노트북", "마우스"],
      totalAmount: 1250000,
      status: "pending",
      orderDate: "2024-01-15",
      paymentMethod: "card",
    },
    {
      id: "2",
      customerName: "이영희",
      products: ["스마트폰"],
      totalAmount: 800000,
      status: "shipped",
      orderDate: "2024-01-14",
      paymentMethod: "transfer",
    },
    {
      id: "3",
      customerName: "박민수",
      products: ["헤드폰", "키보드"],
      totalAmount: 230000,
      status: "delivered",
      orderDate: "2024-01-13",
      paymentMethod: "card",
    },
    {
      id: "4",
      customerName: "정민지",
      products: ["마우스"],
      totalAmount: 50000,
      status: "cancelled",
      orderDate: "2024-01-12",
      paymentMethod: "card",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const statusOptions = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "processing":
        return "#17a2b8";
      case "shipped":
        return "#007bff";
      case "delivered":
        return "#28a745";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "processing":
        return "처리중";
      case "shipped":
        return "배송중";
      case "delivered":
        return "배송완료";
      case "cancelled":
        return "취소됨";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(
    (order) => statusFilter === "all" || order.status === statusFilter
  );

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    try {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      onError(new Error("주문 상태 업데이트 중 오류가 발생했습니다."));
    }
  };

  const selectedOrderData = orders.find((order) => order.id === selectedOrder);

  const totalRevenue = orders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  return (
    <div
      style={{
        backgroundColor: sharedState.theme === "dark" ? "#333" : "#fff",
        color: sharedState.theme === "dark" ? "#fff" : "#333",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>🛒 주문 관리 앱</h3>
      <p>
        현재 사용자: {sharedState.user?.name} ({sharedState.user?.role})
      </p>

      {/* 필터 */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>상태 필터:</strong>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "전체 상태" : getStatusText(status)}
              </option>
            ))}
          </select>
        </label>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          필터링된 주문: {filteredOrders.length}개
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 주문 목록 */}
        <div>
          <h4>주문 목록</h4>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleOrderSelect(order.id)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  backgroundColor:
                    selectedOrder === order.id ? "#e3f2fd" : "transparent",
                }}
              >
                <div style={{ fontWeight: "bold" }}>주문 #{order.id}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {order.customerName} | {order.orderDate}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {order.products.join(", ")}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    backgroundColor: getStatusColor(order.status) + "20",
                    color: getStatusColor(order.status),
                    display: "inline-block",
                    marginTop: "5px",
                  }}
                >
                  {getStatusText(order.status)} | ₩
                  {order.totalAmount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주문 상세 정보 */}
        <div>
          <h4>주문 상세 정보</h4>
          {selectedOrderData ? (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "15px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <strong>주문 번호:</strong> #{selectedOrderData.id}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>고객명:</strong> {selectedOrderData.customerName}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>주문일:</strong> {selectedOrderData.orderDate}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>상품:</strong> {selectedOrderData.products.join(", ")}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>총 금액:</strong> ₩
                {selectedOrderData.totalAmount.toLocaleString()}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>결제 방법:</strong>{" "}
                {selectedOrderData.paymentMethod === "card"
                  ? "카드"
                  : "계좌이체"}
              </div>
              <div style={{ marginBottom: "15px" }}>
                <strong>현재 상태:</strong>{" "}
                {getStatusText(selectedOrderData.status)}
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>
                  <strong>상태 변경:</strong>
                  <select
                    value={selectedOrderData.status}
                    onChange={(e) =>
                      handleStatusUpdate(selectedOrderData.id, e.target.value)
                    }
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                    }}
                  >
                    {statusOptions
                      .filter((status) => status !== "all")
                      .map((status) => (
                        <option key={status} value={status}>
                          {getStatusText(status)}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "5px",
                  fontSize: "12px",
                }}
              >
                <strong>배송 정보:</strong>
                <br />
                • 배송 주소: 서울시 강남구 테헤란로 123
                <br />
                • 연락처: 010-1234-5678
                <br />• 배송 예정일:{" "}
                {new Date(
                  Date.now() + 3 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "15px",
                textAlign: "center",
                color: "#666",
              }}
            >
              주문을 선택해주세요
            </div>
          )}
        </div>
      </div>

      {/* 주문 통계 */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <h4>📊 주문 통계</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "15px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}
            >
              {orders.length}
            </div>
            <div style={{ fontSize: "12px" }}>총 주문 수</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#ffc107" }}
            >
              {pendingOrders}
            </div>
            <div style={{ fontSize: "12px" }}>대기 주문</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}
            >
              ₩{(totalRevenue / 1000000).toFixed(1)}M
            </div>
            <div style={{ fontSize: "12px" }}>총 매출</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#17a2b8" }}
            >
              {orders.filter((o) => o.status === "delivered").length}
            </div>
            <div style={{ fontSize: "12px" }}>완료 주문</div>
          </div>
        </div>
      </div>

      {/* 최근 주문 활동 */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      >
        <h4>🕒 최근 주문 활동</h4>
        <div style={{ fontSize: "12px" }}>
          {orders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              style={{
                padding: "5px 0",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                주문 #{order.id} - {order.customerName}
              </span>
              <span
                style={{
                  padding: "2px 6px",
                  borderRadius: "3px",
                  backgroundColor: getStatusColor(order.status) + "20",
                  color: getStatusColor(order.status),
                  fontSize: "10px",
                }}
              >
                {getStatusText(order.status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
          fontSize: "12px",
        }}
      >
        <strong>앱 정보:</strong> 주문 관리 앱 v1.5.0 | 팀: Order Team
      </div>
    </div>
  );
};

export default OrderApp;
