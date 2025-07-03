import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQueries,
} from "@tanstack/react-query";

// API 함수들 (실제로는 외부 API 호출)
const api = {
  // 사용자 관련 API
  getUsers: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      { id: 1, name: "김철수", email: "kim@example.com", role: "admin" },
      { id: 2, name: "이영희", email: "lee@example.com", role: "user" },
      { id: 3, name: "박민수", email: "park@example.com", role: "manager" },
      { id: 4, name: "정민지", email: "jung@example.com", role: "user" },
    ];
  },

  getUser: async (id: number): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = await api.getUsers();
    const user = users.find((u) => u.id === id);
    if (!user) throw new Error("사용자를 찾을 수 없습니다");
    return user;
  },

  createUser: async (userData: Omit<User, "id">): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser = { ...userData, id: Date.now() };
    return newUser;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { id, ...userData } as User;
  },

  deleteUser: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    // 실제로는 서버에서 삭제
  },

  // 게시물 관련 API (페이지네이션)
  getPosts: async ({
    pageParam = 1,
  }): Promise<{ posts: Post[]; nextPage: number | null }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const postsPerPage = 5;
    const allPosts: Post[] = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `게시물 ${i + 1}`,
      content: `이것은 게시물 ${i + 1}의 내용입니다.`,
      author: `작성자 ${Math.floor(i / 5) + 1}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));

    const startIndex = (pageParam - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const posts = allPosts.slice(startIndex, endIndex);
    const nextPage = endIndex < allPosts.length ? pageParam + 1 : null;

    return { posts, nextPage };
  },

  // 통계 API
  getStats: async (): Promise<Stats> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      totalUsers: 150,
      activeUsers: 89,
      totalPosts: 1250,
      totalViews: 45600,
    };
  },
};

// 타입 정의
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalViews: number;
}

// React Query 키 상수
const queryKeys = {
  users: ["users"] as const,
  user: (id: number) => ["user", id] as const,
  posts: ["posts"] as const,
  stats: ["stats"] as const,
};

// React Query 데모 컴포넌트
const ReactQueryDemo: React.FC<{ title: string }> = ({ title }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });
  const queryClient = useQueryClient();

  // 1. 기본 쿼리 - 사용자 목록
  const usersQuery = useQuery({
    queryKey: queryKeys.users,
    queryFn: api.getUsers,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
  });

  // 2. 개별 사용자 쿼리
  const userQuery = useQuery({
    queryKey: queryKeys.user(selectedUserId!),
    queryFn: () => api.getUser(selectedUserId!),
    enabled: !!selectedUserId, // selectedUserId가 있을 때만 실행
  });

  // 3. 무한 쿼리 - 게시물 페이지네이션
  const postsQuery = useInfiniteQuery({
    queryKey: queryKeys.posts,
    queryFn: api.getPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  // 4. 병렬 쿼리 - 통계 데이터
  const statsQuery = useQuery({
    queryKey: queryKeys.stats,
    queryFn: api.getStats,
    refetchInterval: 30000, // 30초마다 자동 갱신
  });

  // 5. 뮤테이션 - 사용자 생성
  const createUserMutation = useMutation({
    mutationFn: api.createUser,
    onSuccess: (newUser) => {
      // 캐시 무효화 및 업데이트
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.setQueryData(queryKeys.users, (old: User[] | undefined) =>
        old ? [...old, newUser] : [newUser]
      );
      setNewUser({ name: "", email: "", role: "user" });
    },
    onError: (error) => {
      console.error("사용자 생성 실패:", error);
    },
  });

  // 6. 뮤테이션 - 사용자 수정
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<User> }) =>
      api.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      // 개별 사용자 캐시 업데이트
      queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);
      // 사용자 목록 캐시 업데이트
      queryClient.setQueryData(queryKeys.users, (old: User[] | undefined) =>
        old?.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    },
  });

  // 7. 뮤테이션 - 사용자 삭제
  const deleteUserMutation = useMutation({
    mutationFn: api.deleteUser,
    onSuccess: (_, deletedId) => {
      // 캐시에서 제거
      queryClient.setQueryData(queryKeys.users, (old: User[] | undefined) =>
        old?.filter((user) => user.id !== deletedId)
      );
      if (selectedUserId === deletedId) {
        setSelectedUserId(null);
      }
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.name && newUser.email) {
      createUserMutation.mutate(newUser);
    }
  };

  const handleUpdateUser = (id: number, updates: Partial<User>) => {
    updateUserMutation.mutate({ id, userData: updates });
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteUserMutation.mutate(id);
    }
  };

  return (
    <div
      style={{
        border: "2px solid #28a745",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px 0",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h2 style={{ color: "#28a745", marginBottom: "20px" }}>{title}</h2>

      <div style={{ marginBottom: "30px" }}>
        <h3>🔄 React Query (TanStack Query) 개요</h3>
        <p>
          서버 상태를 효율적으로 관리하는 라이브러리입니다. 캐싱, 동기화,
          백그라운드 업데이트를 자동으로 처리합니다.
        </p>

        <div
          style={{
            backgroundColor: "#e9ecef",
            padding: "15px",
            borderRadius: "5px",
            margin: "10px 0",
          }}
        >
          <h4>🎯 React Query의 장점</h4>
          <ul>
            <li>
              <strong>자동 캐싱:</strong> 데이터를 자동으로 캐시하고 관리
            </li>
            <li>
              <strong>백그라운드 갱신:</strong> 포커스 시 자동으로 데이터 갱신
            </li>
            <li>
              <strong>오프라인 지원:</strong> 네트워크 오류 시 자동 재시도
            </li>
            <li>
              <strong>낙관적 업데이트:</strong> UI를 즉시 업데이트하고
              백그라운드에서 동기화
            </li>
            <li>
              <strong>무한 스크롤:</strong> 페이지네이션을 쉽게 구현
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 왼쪽: 사용자 관리 */}
        <div>
          <h3>👥 사용자 관리</h3>

          {/* 사용자 생성 폼 */}
          <div style={{ marginBottom: "20px" }}>
            <h4>새 사용자 생성</h4>
            <form
              onSubmit={handleCreateUser}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  placeholder="이름"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
                />
                <input
                  type="email"
                  placeholder="이메일"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <option value="user">사용자</option>
                  <option value="admin">관리자</option>
                  <option value="manager">매니저</option>
                </select>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: createUserMutation.isPending
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {createUserMutation.isPending ? "생성 중..." : "사용자 생성"}
                </button>
              </div>
            </form>
          </div>

          {/* 사용자 목록 */}
          <div style={{ marginBottom: "20px" }}>
            <h4>사용자 목록</h4>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {usersQuery.isLoading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  로딩 중...
                </div>
              ) : usersQuery.isError ? (
                <div
                  style={{
                    color: "#dc3545",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  오류: {usersQuery.error.message}
                </div>
              ) : (
                usersQuery.data?.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      padding: "10px",
                      border: "1px solid #eee",
                      borderRadius: "5px",
                      marginBottom: "10px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedUserId === user.id ? "#e3f2fd" : "transparent",
                    }}
                    onClick={() => setSelectedUserId(user.id)}
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
                        backgroundColor: "#d4edda",
                        color: "#155724",
                        display: "inline-block",
                        marginTop: "5px",
                      }}
                    >
                      {user.role}
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateUser(user.id, {
                            role: user.role === "admin" ? "user" : "admin",
                          });
                        }}
                        disabled={updateUserMutation.isPending}
                        style={{
                          padding: "5px 10px",
                          marginRight: "5px",
                          backgroundColor: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: "3px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        역할 변경
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(user.id);
                        }}
                        disabled={deleteUserMutation.isPending}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "3px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 선택된 사용자 상세 정보 */}
          {selectedUserId && (
            <div style={{ marginBottom: "20px" }}>
              <h4>선택된 사용자 상세</h4>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              >
                {userQuery.isLoading ? (
                  <div>사용자 정보 로딩 중...</div>
                ) : userQuery.isError ? (
                  <div style={{ color: "#dc3545" }}>
                    오류: {userQuery.error.message}
                  </div>
                ) : (
                  <div>
                    <h5>{userQuery.data?.name}</h5>
                    <p>
                      <strong>이메일:</strong> {userQuery.data?.email}
                    </p>
                    <p>
                      <strong>역할:</strong> {userQuery.data?.role}
                    </p>
                    <p>
                      <strong>마지막 업데이트:</strong>{" "}
                      {userQuery.dataUpdatedAt
                        ? new Date(userQuery.dataUpdatedAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽: 게시물 및 통계 */}
        <div>
          <h3>📝 게시물 & 통계</h3>

          {/* 통계 */}
          <div style={{ marginBottom: "20px" }}>
            <h4>📊 실시간 통계</h4>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            >
              {statsQuery.isLoading ? (
                <div>통계 로딩 중...</div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#007bff",
                      }}
                    >
                      {statsQuery.data?.totalUsers}
                    </div>
                    <div style={{ fontSize: "12px" }}>총 사용자</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#28a745",
                      }}
                    >
                      {statsQuery.data?.activeUsers}
                    </div>
                    <div style={{ fontSize: "12px" }}>활성 사용자</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#ffc107",
                      }}
                    >
                      {statsQuery.data?.totalPosts}
                    </div>
                    <div style={{ fontSize: "12px" }}>총 게시물</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#17a2b8",
                      }}
                    >
                      {statsQuery.data?.totalViews}
                    </div>
                    <div style={{ fontSize: "12px" }}>총 조회수</div>
                  </div>
                </div>
              )}
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                {statsQuery.dataUpdatedAt
                  ? `마지막 업데이트: ${new Date(
                      statsQuery.dataUpdatedAt
                    ).toLocaleTimeString()}`
                  : "업데이트 정보 없음"}
              </div>
            </div>
          </div>

          {/* 게시물 목록 (무한 스크롤) */}
          <div style={{ marginBottom: "20px" }}>
            <h4>📄 게시물 목록 (무한 스크롤)</h4>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {postsQuery.isLoading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  게시물 로딩 중...
                </div>
              ) : (
                <>
                  {postsQuery.data?.pages.map((page, pageIndex) => (
                    <div key={pageIndex}>
                      {page.posts.map((post) => (
                        <div
                          key={post.id}
                          style={{
                            padding: "10px",
                            border: "1px solid #eee",
                            borderRadius: "5px",
                            marginBottom: "10px",
                          }}
                        >
                          <div style={{ fontWeight: "bold" }}>{post.title}</div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#666",
                              marginBottom: "5px",
                            }}
                          >
                            {post.content.substring(0, 100)}...
                          </div>
                          <div style={{ fontSize: "10px", color: "#999" }}>
                            작성자: {post.author} |{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                  {postsQuery.hasNextPage && (
                    <button
                      onClick={() => postsQuery.fetchNextPage()}
                      disabled={postsQuery.isFetchingNextPage}
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {postsQuery.isFetchingNextPage ? "로딩 중..." : "더 보기"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 쿼리 상태 정보 */}
          <div style={{ marginBottom: "20px" }}>
            <h4>🔍 쿼리 상태</h4>
            <div
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "12px",
              }}
            >
              <div>
                <strong>사용자 쿼리:</strong>
              </div>
              <div>• 로딩: {usersQuery.isLoading ? "예" : "아니오"}</div>
              <div>• 오류: {usersQuery.isError ? "예" : "아니오"}</div>
              <div>
                • 데이터:{" "}
                {usersQuery.data ? `${usersQuery.data.length}개` : "없음"}
              </div>
              <div>
                • 마지막 업데이트:{" "}
                {usersQuery.dataUpdatedAt
                  ? new Date(usersQuery.dataUpdatedAt).toLocaleTimeString()
                  : "N/A"}
              </div>

              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => usersQuery.refetch()}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  사용자 목록 새로고침
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#e9ecef",
          padding: "15px",
          borderRadius: "5px",
          marginTop: "20px",
        }}
      >
        <h3>💡 React Query 모범 사례</h3>
        <ul>
          <li>
            <strong>쿼리 키 설계:</strong> 계층적이고 일관된 쿼리 키 사용
          </li>
          <li>
            <strong>캐시 전략:</strong> staleTime과 gcTime을 적절히 설정
          </li>
          <li>
            <strong>오류 처리:</strong> 사용자 친화적인 오류 메시지 제공
          </li>
          <li>
            <strong>낙관적 업데이트:</strong> 사용자 경험 향상을 위한 즉시 UI
            업데이트
          </li>
          <li>
            <strong>백그라운드 동기화:</strong> 포커스 시 자동 갱신 활용
          </li>
          <li>
            <strong>무한 쿼리:</strong> 대용량 데이터의 효율적인 페이지네이션
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReactQueryDemo;
