import { Children, createContext, useContext, useState } from "react";

const AppContext = createContext(undefined)
const defaultUser = {
  id: 'user-1',
  name: 'Khoi Hoang',
  email: 'khoihoang252007@gmail.com',
  role: 'user',
  phone: '+84 908 123 456',
  city: 'Ho Chi Minh City',
  preferredType: '7-a-side',
};

export const AppProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(defaultUser)

    const value = {
        currentUser,
        setCurrentUser
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}