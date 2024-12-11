import { Outlet } from 'react'
import { useLocation, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Layout from '../Layout';

export const RequireAuth = () => {

    const location = useLocation();
    const { auth, isLoading } = useAuth();

    if (auth?.user) {
        console.log('from RequireAuth', auth);
    }
    return auth?.user
        ? <div><Layout /></div>
        : <Navigate to={'/auth/login'} state={{ from: location }} replace />

}
