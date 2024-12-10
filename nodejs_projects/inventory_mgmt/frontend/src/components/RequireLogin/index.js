import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const RequireLogin = ({ children }) => {

    const navigate = useNavigate();
    
    // useEffect(() => {
    //     if (!user) {
    //         navigate("/auth/login");
    //     }
    // }, [user]);
    
    return (
        <div>{children}</div>
    )
}

export default RequireLogin;