import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && roles.length > 0) {
        const userRoles = Array.isArray(user.role) ? user.role : [user.role];
        const hasAccess = userRoles.some(r => roles.includes(r));
        if (!hasAccess) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
