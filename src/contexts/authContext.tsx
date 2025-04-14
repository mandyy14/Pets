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
    celular: string | null;
    endereco: string | null;
    login: string;
    email: string;
    cargo: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    profilePicVersion: number;
    refreshProfilePicVersion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profilePicVersion, setProfilePicVersion] = useState(0); // Inicia em 0

    useEffect(() => {
        console.log("AuthProvider: useEffect running - checking localStorage");
        try {
            const storedUser = localStorage.getItem('authUser');
            console.log("AuthProvider: storedUser from localStorage:", storedUser);
            if (storedUser && storedUser !== 'undefined') {
                const parsedUser = JSON.parse(storedUser) as User;
                delete (parsedUser as any).profileImageUrl;
                delete (parsedUser as any).updateUserProfilePicture;
                delete (parsedUser as any).refreshProfilePicVersion;
                setUser(parsedUser);
                console.log("AuthProvider: User loaded from localStorage");
            } else {
                console.log("AuthProvider: No valid user in localStorage");
            }
        } catch (error) {
            console.error("AuthContext: Failed to parse user from localStorage", error);
            localStorage.removeItem('authUser');
        } finally {
            setIsLoading(false);
            console.log("AuthProvider: Initial loading finished. isLoading:", false);
        }
    }, []);

    const login = (userData: User) => {
        console.log("AuthProvider: login function called with:", userData);
         const { profileImageUrl, ...userToStore } = userData as any;
        setUser(userToStore);
        localStorage.setItem('authUser', JSON.stringify(userToStore));
        setProfilePicVersion(v => v + 1);
    };

    const logout = () => {
        console.log("AuthProvider: logout function called");
        setUser(null);
        localStorage.removeItem('authUser');
        setProfilePicVersion(0);
    };

    const refreshProfilePicVersion = () => {
        console.log("AuthProvider: refreshProfilePicVersion called");
        setProfilePicVersion(v => v + 1);
    };

    const contextValue: AuthContextType = {
        user,
        isLoading,
        login,
        logout,
        profilePicVersion,
        refreshProfilePicVersion
    };

    console.log("AuthProvider: Rendering Provider. User:", user?.id, "isLoading:", isLoading, "PicVersion:", profilePicVersion);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
     const context = useContext(AuthContext);
    if (context === undefined) { throw new Error('useAuth must be used within an AuthProvider'); }
    return context;
};
