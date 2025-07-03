import React, { createContext, useContext, useReducer, ReactNode } from "react";

// 1. 상태 타입 정의
interface AppState {
  user: {
    name: string;
    isLoggedIn: boolean;
    role: "admin" | "user" | "guest";
  };
  theme: {
    mode: "light" | "dark";
    primaryColor: string;
  };
  notifications: {
    count: number;
    messages: string[];
  };
  cart: {
    items: CartItem[];
    total: number;
  };
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// 2. 액션 타입 정의
type AppAction =
  | {
      type: "LOGIN";
      payload: { name: string; role: "admin" | "user" | "guest" };
    }
  | { type: "LOGOUT" }
  | { type: "CHANGE_THEME"; payload: "light" | "dark" }
  | { type: "CHANGE_PRIMARY_COLOR"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_CART_QUANTITY"; payload: { id: number; quantity: number } };

// 3. 초기 상태
const initialState: AppState = {
  user: {
    name: "",
    isLoggedIn: false,
    role: "guest",
  },
  theme: {
    mode: "light",
    primaryColor: "#007bff",
  },
  notifications: {
    count: 0,
    messages: [],
  },
  cart: {
    items: [],
    total: 0,
  },
};

// 4. 리듀서 함수
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: {
          name: action.payload.name,
          isLoggedIn: true,
          role: action.payload.role,
        },
      };

    case "LOGOUT":
      return {
        ...state,
        user: {
          name: "",
          isLoggedIn: false,
          role: "guest",
        },
      };

    case "CHANGE_THEME":
      return {
        ...state,
        theme: {
          ...state.theme,
          mode: action.payload,
        },
      };

    case "CHANGE_PRIMARY_COLOR":
      return {
        ...state,
        theme: {
          ...state.theme,
          primaryColor: action.payload,
        },
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: {
          count: state.notifications.count + 1,
          messages: [...state.notifications.messages, action.payload],
        },
      };

    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: {
          count: 0,
          messages: [],
        },
      };

    case "ADD_TO_CART":
      const existingItem = state.cart.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        const updatedItems = state.cart.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          cart: {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
          },
        };
      } else {
        const newItems = [...state.cart.items, action.payload];
        return {
          ...state,
          cart: {
            items: newItems,
            total: newItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ),
          },
        };
      }

    case "REMOVE_FROM_CART":
      const filteredItems = state.cart.items.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        cart: {
          items: filteredItems,
          total: filteredItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        },
      };

    case "UPDATE_CART_QUANTITY":
      const updatedItems = state.cart.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        cart: {
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        },
      };

    default:
      return state;
  }
};

// 5. Context 생성
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// 6. Provider 컴포넌트
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 7. 커스텀 훅 (Context 사용을 위한 헬퍼)
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// 8. 선택적 상태 접근을 위한 커스텀 훅들
export const useUser = () => {
  const { state, dispatch } = useAppContext();
  return {
    user: state.user,
    login: (name: string, role: "admin" | "user" | "guest") =>
      dispatch({ type: "LOGIN", payload: { name, role } }),
    logout: () => dispatch({ type: "LOGOUT" }),
  };
};

export const useTheme = () => {
  const { state, dispatch } = useAppContext();
  return {
    theme: state.theme,
    changeTheme: (mode: "light" | "dark") =>
      dispatch({ type: "CHANGE_THEME", payload: mode }),
    changePrimaryColor: (color: string) =>
      dispatch({ type: "CHANGE_PRIMARY_COLOR", payload: color }),
  };
};

export const useNotifications = () => {
  const { state, dispatch } = useAppContext();
  return {
    notifications: state.notifications,
    addNotification: (message: string) =>
      dispatch({ type: "ADD_NOTIFICATION", payload: message }),
    clearNotifications: () => dispatch({ type: "CLEAR_NOTIFICATIONS" }),
  };
};

export const useCart = () => {
  const { state, dispatch } = useAppContext();
  return {
    cart: state.cart,
    addToCart: (item: CartItem) =>
      dispatch({ type: "ADD_TO_CART", payload: item }),
    removeFromCart: (id: number) =>
      dispatch({ type: "REMOVE_FROM_CART", payload: id }),
    updateQuantity: (id: number, quantity: number) =>
      dispatch({ type: "UPDATE_CART_QUANTITY", payload: { id, quantity } }),
  };
};
