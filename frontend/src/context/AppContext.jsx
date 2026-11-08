import { Children, createContext, useContext, useState } from "react";

const AppContext = createContext(undefined);
const defaultUser = {
  id: "user-1",
  name: "Khoi Hoang",
  email: "khoihoang252007@gmail.com",
  role: "user",
  phone: "+84 908 123 456",
  city: "Ho Chi Minh City",
  preferredType: "7-a-side",
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  });
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = "toast-" + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  const value = {
    currentUser,
    setCurrentUser,
    toasts,
    addToast,
    removeToast,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
