'use client';

import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect
} from 'react';

interface User {
    id: number;
    nome: string;
    cpf: string;
    celular: string;
    endereco: string;
    login: string;
    email: string;
    cargo: string;
    profileImageUrl?: string | null;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUserProfilePicture: (imageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("AuthProvider: useEffect running - checking localStorage"); // Log de Debug
        try {
            const storedUser = localStorage.getItem('authUser');
            console.log("AuthProvider: storedUser from localStorage:", storedUser); // Log de Debug
            if (storedUser && storedUser !== 'undefined') {
                setUser(JSON.parse(storedUser));
                console.log("AuthProvider: User loaded from localStorage"); // Log de Debug
            } else {
                console.log("AuthProvider: No valid user in localStorage"); // Log de Debug
            }
        } catch (error) {
            console.error("AuthContext: Failed to parse user from localStorage", error);
            localStorage.removeItem('authUser');
        } finally {
            setIsLoading(false);
            console.log("AuthProvider: Initial loading finished. isLoading:", false); // Log de Debug
        }
    }, []);

    const login = (userData: User) => {
        console.log("AuthProvider: login function called with:", userData);
        setUser(userData);
        try {
            localStorage.setItem('authUser', JSON.stringify(userData));
            console.log("AuthProvider: User saved to localStorage"); // Log de Debug
        } catch (error) {
            console.error("AuthContext: Failed to save user to localStorage", error);
        }
    };

    const logout = () => {
        console.log("AuthProvider: logout function called"); // Log de Debug
        setUser(null);
        try {
            localStorage.removeItem('authUser');
            console.log("AuthProvider: User removed from localStorage"); // Log de Debug
        } catch (error) {
            console.error("AuthContext: Failed to remove user from localStorage", error);
        }
    };

    const updateUserProfilePicture = (imageUrl: string) => {
         console.log("AuthProvider: updateUserProfilePicture called with:", imageUrl); // Log de Debug
        setUser(currentUser => {
            if (!currentUser) {
                console.log("AuthProvider: updateUserProfilePicture - no current user, returning null"); // Log de Debug
                 return null;
            }
            const updatedUser = { ...currentUser, profileImageUrl: imageUrl };
            try {
                localStorage.setItem('authUser', JSON.stringify(updatedUser));
                 console.log("AuthProvider: Updated user picture saved to localStorage"); // Log de Debug
            } catch (error) {
                console.error("AuthContext: Failed to update profile picture in localStorage", error);
            }
            return updatedUser;
        });
    };

    const contextValue: AuthContextType = {
        user,
        isLoading,
        login,
        logout,
        updateUserProfilePicture
    };

    console.log("AuthProvider: Rendering Provider. User:", user, "isLoading:", isLoading); // Log de Debug

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
