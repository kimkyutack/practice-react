import React, { useState } from "react";

interface UserAppProps {
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

const UserApp: React.FC<UserAppProps> = ({
  sharedState,
  onSharedStateChange,
  onError,
}) => {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "김철수",
      email: "kim@example.com",
      role: "admin",
      status: "active",
    },
    {
      id: "2",
      name: "이영희",
      email: "lee@example.com",
      role: "user",
      status: "active",
    },
    {
      id: "3",
      name: "박민수",
      email: "park@example.com",
      role: "manager",
      status: "inactive",
    },
    {
      id: "4",
      name: "정민지",
      email: "jung@example.com",
      role: "user",
      status: "active",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    setIsEditing(false);
  };

  const handleUserEdit = () => {
    setIsEditing(true);
  };

  const handleUserDelete = (userId: string) => {
    try {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      if (selectedUser === userId) {
        setSelectedUser(null);
        setIsEditing(false);
      }
    } catch (error) {
      onError(new Error("사용자 삭제 중 오류가 발생했습니다."));
    }
  };

  const selectedUserData = users.find((user) => user.id === selectedUser);

  return (
    <div
      style={{
        backgroundColor: sharedState.theme === "dark" ? "#333" : "#fff",
        color: sharedState.theme === "dark" ? "#fff" : "#333",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>👥 사용자 관리 앱</h3>
      <p>
        현재 사용자: {sharedState.user?.name} ({sharedState.user?.role})
      </p>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 사용자 목록 */}
        <div>
          <h4>사용자 목록</h4>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user.id)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  backgroundColor:
                    selectedUser === user.id ? "#e3f2fd" : "transparent",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{user.name}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {user.email}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    backgroundColor:
                      user.status === "active" ? "#d4edda" : "#f8d7da",
                    color: user.status === "active" ? "#155724" : "#721c24",
                    display: "inline-block",
                    marginTop: "5px",
                  }}
                >
                  {user.role} | {user.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 사용자 상세 정보 */}
        <div>
          <h4>사용자 상세 정보</h4>
          {selectedUserData ? (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "15px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <strong>이름:</strong> {selectedUserData.name}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>이메일:</strong> {selectedUserData.email}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>역할:</strong> {selectedUserData.role}
              </div>
              <div style={{ marginBottom: "15px" }}>
                <strong>상태:</strong> {selectedUserData.status}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleUserEdit}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  수정
                </button>
                <button
                  onClick={() => handleUserDelete(selectedUserData.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
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
              사용자를 선택해주세요
            </div>
          )}
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
        <strong>앱 정보:</strong> 사용자 관리 앱 v1.2.0 | 팀: User Team
      </div>
    </div>
  );
};

export default UserApp;
