import useAuth from './useAuth';
import { publicAxios } from '../api/axios';


const REFRESH_URL = '/users/auth/refresh';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    /**
     * This function send refresh token and return new access token
     */
    const refresh = async () => {
        const response = await publicAxios.get(REFRESH_URL, {
            withCredentials: true
        });
        setAuth((prev) => {
            return {
                ...prev, user: response.data.data.user,
                accessToken: response.data.data.accessToken
            }
        });
        return response.data.data.accessToken;
    }
    return refresh;
}

export default useRefreshToken;