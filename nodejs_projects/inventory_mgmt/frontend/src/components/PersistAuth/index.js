import useAuth from '../../hooks/useAuth';
import useRefreshToken from '../../hooks/useRefreshToken';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BounceLoader from "react-spinners/BounceLoader";


const PersistAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const refreshAuth = async () => {
            if (localStorage.getItem('rememberMe')) {
                try {
                    await refresh();
                } catch (error) {
                    console.error(error);
                    return;
                } finally {
                    setIsLoading(false);
                }
            }
        }

        !auth?.accessToken ? refreshAuth() : setIsLoading(false);
    })

    return isLoading
        ? <BounceLoader
            color="#09AC"
            size={100}
            speedMultiplier={2}
            className="mt-[25%] ml-[50%] -translate-x-[50%] -translate-y-[50%]"
        />
        : <Outlet />

}

export default PersistAuth;