import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useGetFetch = ({ url, formData }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState({});
    const axiosPrivate = useAxiosPrivate();
    console.log(url)

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const response = await axiosPrivate.get(url, {
                    signal: controller.signal,
                });
                const data = response.data.data;
                setData(data)
            } catch (err) {
                setError(err.toString())
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [url, formData]);

    return { isLoading, data, error }
}

export default useGetFetch;