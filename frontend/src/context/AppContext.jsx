import { Children, createContext, useContext, useState } from "react";

const AppContext = createContext(undefined)

export const AppProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(undefined)

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