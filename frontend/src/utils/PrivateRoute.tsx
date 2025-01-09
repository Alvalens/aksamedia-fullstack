import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../pages/Loader';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <Loader />;
    
    if (!user) {
        return <Navigate to="/" />;
    }

    return <>{children}</>
};

export default PrivateRoute;
