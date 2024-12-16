import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import { publicAxios } from "../api/axios";

const useGetFetch = ({ url }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState({});
    const axiosPrivate = useAxiosPrivate();


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const controller = new AbortController();
        try {
            const response = await publicAxios.get(url, {
                withCredentials: true,
                signal: controller.signal,
            });
            const data = response.data; setData(data);
        } catch (err) {
            setError(err.toString());
        } finally {
            setIsLoading(false);
        } return () => {
            controller.abort();

        };
    }, [url]);

    return { isLoading, data, error, fetchData }
}

export default useGetFetch;