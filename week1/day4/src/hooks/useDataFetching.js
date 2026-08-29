import {
    useCallback,
    useEffect,
    useState
} from "react";


export function useDataFetching(
    fetchFunction,
    autoFetch = true
) {

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);


    const fetchData =
        useCallback(
            async () => {

                setLoading(true);

                setError(null);


                try {

                    const result =
                        await fetchFunction();


                    setData(result);

                    return result;

                } catch (err) {

                    setError(
                        err.message
                    );

                } finally {

                    setLoading(false);

                }

            },
            [fetchFunction]
        );


    useEffect(() => {

        if (autoFetch) {
            fetchData();
        }

    }, [
        autoFetch,
        fetchData
    ]);


    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
}