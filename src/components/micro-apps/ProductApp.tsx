import React, { useState } from "react";

interface ProductAppProps {
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

const ProductApp: React.FC<ProductAppProps> = ({
  sharedState,
  onSharedStateChange,
  onError,
}) => {
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "노트북",
      category: "전자제품",
      price: 1200000,
      stock: 15,
      status: "active",
    },
    {
      id: "2",
      name: "스마트폰",
      category: "전자제품",
      price: 800000,
      stock: 25,
      status: "active",
    },
    {
      id: "3",
      name: "헤드폰",
      category: "액세서리",
      price: 150000,
      stock: 50,
      status: "active",
    },
    {
      id: "4",
      name: "키보드",
      category: "액세서리",
      price: 80000,
      stock: 30,
      status: "inactive",
    },
    {
      id: "5",
      name: "마우스",
      category: "액세서리",
      price: 50000,
      stock: 40,
      status: "active",
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "전자제품", "액세서리", "의류", "도서"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    try {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
    } catch (error) {
      onError(new Error("재고 업데이트 중 오류가 발생했습니다."));
    }
  };

  const selectedProductData = products.find(
    (product) => product.id === selectedProduct
  );

  return (
    <div
      style={{
        backgroundColor: sharedState.theme === "dark" ? "#333" : "#fff",
        color: sharedState.theme === "dark" ? "#fff" : "#333",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>📦 상품 관리 앱</h3>
      <p>
        현재 사용자: {sharedState.user?.name} ({sharedState.user?.role})
      </p>

      {/* 검색 및 필터 */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="상품명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              flex: 1,
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "전체 카테고리" : category}
              </option>
            ))}
          </select>
        </div>
        <div style={{ fontSize: "12px", color: "#666" }}>
          검색 결과: {filteredProducts.length}개 상품
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* 상품 목록 */}
        <div>
          <h4>상품 목록</h4>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "5px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  backgroundColor:
                    selectedProduct === product.id ? "#e3f2fd" : "transparent",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{product.name}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {product.category} | ₩{product.price.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    backgroundColor: product.stock > 0 ? "#d4edda" : "#f8d7da",
                    color: product.stock > 0 ? "#155724" : "#721c24",
                    display: "inline-block",
                    marginTop: "5px",
                  }}
                >
                  재고: {product.stock}개 | {product.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 상품 상세 정보 */}
        <div>
          <h4>상품 상세 정보</h4>
          {selectedProductData ? (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "15px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <strong>상품명:</strong> {selectedProductData.name}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>카테고리:</strong> {selectedProductData.category}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>가격:</strong> ₩
                {selectedProductData.price.toLocaleString()}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>재고:</strong> {selectedProductData.stock}개
              </div>
              <div style={{ marginBottom: "15px" }}>
                <strong>상태:</strong> {selectedProductData.status}
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label>
                  <strong>재고 수정:</strong>
                  <input
                    type="number"
                    value={selectedProductData.stock}
                    onChange={(e) =>
                      handleStockUpdate(
                        selectedProductData.id,
                        parseInt(e.target.value) || 0
                      )
                    }
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      border: "1px solid #ddd",
                      borderRadius: "3px",
                      width: "80px",
                    }}
                  />
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
                <strong>상품 통계:</strong>
                <br />• 총 판매량: {Math.floor(Math.random() * 1000)}개<br />•
                평균 평점: {(Math.random() * 2 + 3).toFixed(1)}/5.0
                <br />• 리뷰 수: {Math.floor(Math.random() * 500)}개
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
              상품을 선택해주세요
            </div>
          )}
        </div>
      </div>

      {/* 상품 통계 */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <h4>📊 상품 통계</h4>
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
              {products.length}
            </div>
            <div style={{ fontSize: "12px" }}>총 상품 수</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}
            >
              {products.filter((p) => p.status === "active").length}
            </div>
            <div style={{ fontSize: "12px" }}>활성 상품</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#ffc107" }}
            >
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </div>
            <div style={{ fontSize: "12px" }}>총 재고</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#dc3545" }}
            >
              {products.filter((p) => p.stock === 0).length}
            </div>
            <div style={{ fontSize: "12px" }}>품절 상품</div>
          </div>
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
        <strong>앱 정보:</strong> 상품 관리 앱 v2.1.0 | 팀: Product Team
      </div>
    </div>
  );
};

export default ProductApp;
