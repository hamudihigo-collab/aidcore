import { useState, useEffect } from 'react';

export const useFetch = (asyncFunction, dependencies = []) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await asyncFunction();
                setData(result);
            } catch (err) {
                setError(err);
                console.error('Fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, dependencies);

    return { data, isLoading, error };
};
