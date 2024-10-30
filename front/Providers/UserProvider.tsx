"use client";
import { createContext, useContext, useState } from 'react';

// Definindo o tipo para o contexto do usuário
interface UserContextType {
    user: any;
    setUser: (user: any) => void;
}


const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para usar o UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};