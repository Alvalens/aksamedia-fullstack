import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    phone: string;
}

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (updatedUser: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
        setLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setLoading(true);
        const user = {
            id: '1',
            username: 'testuser',
            password: 'password',
            name: 'John Doe',
            email: 'user@user.com',
            phone: '123-456-7890',
        };

        return new Promise((resolve) => {
            setTimeout(() => {
                if (username === user.username && password === user.password) {
                    localStorage.setItem('user', JSON.stringify(user));
                    setUser(user);
                    setLoading(false);
                    resolve(true);
                } else {
                    setLoading(false);
                    resolve(false);
                }
            }, 1000); // Simulate an async operation
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateUser = (updatedUser: UserProfile) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export default AuthProvider;