import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
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

        try {
            const response = await axiosInstance.post('login', { username, password });

            if (response.data.status === 'success') {
                const user = response.data.data.admin;
                const token = response.data.data.token;

                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);

                setUser(user);
                setLoading(false);
                return true;
            } else if (response.data.status === 'error') {
                const errors = response.data.errors;
                setLoading(false);
                throw new Error(errors ? Object.values(errors).flat().join(' ') : 'Something went wrong');
            } else {
                setLoading(false);
                return false;
            }
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };


    const logout = async () => {
        setLoading(true);
        const response = await axiosInstance.post('logout');
        if (response.data.status === 'success') {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        setLoading(false);
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