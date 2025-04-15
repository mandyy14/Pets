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
    profilePicVersion: number;
    login: (userData: User) => void;
    logout: () => void;
    refreshProfilePicVersion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profilePicVersion, setProfilePicVersion] = useState(0);

    useEffect(() => {
        console.log("AuthProvider: Checking localStorage");
        try {
            const storedUser = localStorage.getItem('authUser');
            if (storedUser && storedUser !== 'undefined') {
                const parsedUser = JSON.parse(storedUser) as User;
                delete (parsedUser as any).profileImageUrl;
                delete (parsedUser as any).updateUserProfilePicture;
                delete (parsedUser as any).refreshProfilePicVersion;
                setUser(parsedUser);
                console.log("AuthProvider: User loaded");
            } else {
                console.log("AuthProvider: No valid user");
            }
        } catch (error) {
             console.error("AuthContext: Failed parsing localStorage", error);
             localStorage.removeItem('authUser');
        } finally {
            setIsLoading(false);
            console.log("AuthProvider: Initial loading done");
        }
    }, []);

    const login = (userData: User) => {
        console.log("AuthProvider: login called");
        const { profileImageUrl, ...userToStore } = userData as any;
        setUser(userToStore);
        localStorage.setItem('authUser', JSON.stringify(userToStore));
        setProfilePicVersion(v => v + 1);
    };

    const logout = () => {
        console.log("AuthProvider: logout called");
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
        profilePicVersion,
        login,
        logout,
        refreshProfilePicVersion
    };

    console.log("AuthProvider: Rendering - User:", user ? user.id : null, "isLoading:", isLoading, "PicVersion:", profilePicVersion);

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
