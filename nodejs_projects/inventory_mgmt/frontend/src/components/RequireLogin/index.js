import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { redirect, useNavigate } from 'react-router-dom';

const RequireLogin = ({ children }) => {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user) {
            console.log(window.location.href);
            navigate("/auth/login");
        }
    }, [window.location.href, user]);
    
    return (
        <div>{children}</div>
    )
}

export default RequireLogin;