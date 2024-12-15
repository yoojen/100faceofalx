import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import { publicAxios } from "../api/axios";

const useGetFetch = ({ url }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState({});
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const response = await publicAxios.get(url, {
                    withCredentials: true,
                    signal: controller.signal,
                });
                const data = response.data;
                setData(data)
            } catch (err) {
                console.log(err);
                setError(err.toString())
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [url]);

    return { isLoading, data, error }
}

export default useGetFetch;