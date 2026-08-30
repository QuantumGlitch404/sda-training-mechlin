import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import { useApiService }
    from "./useApiService";

import { useWebSocket }
    from "./useWebSocket";


const createDemoData = endpoint => {

    if (
        endpoint ===
        "/api/revenue"
    ) {

        return {

            total:
                Math.floor(
                    Math.random() *
                    40000
                ) + 20000,

            change:
                Number(
                    (
                        Math.random() *
                        15
                    ).toFixed(1)
                ),

            updatedAt:
                new Date().toISOString()

        };

    }


    if (
        endpoint ===
        "/api/users"
    ) {

        return {

            total:
                Math.floor(
                    Math.random() *
                    2000
                ) + 1000,

            change:
                Number(
                    (
                        Math.random() *
                        12
                    ).toFixed(1)
                ),

            updatedAt:
                new Date().toISOString()

        };

    }


    if (
        endpoint ===
        "/api/orders"
    ) {

        return {

            total:
                Math.floor(
                    Math.random() *
                    1000
                ) + 500,

            change:
                Number(
                    (
                        Math.random() *
                        18
                    ).toFixed(1)
                ),

            updatedAt:
                new Date().toISOString()

        };

    }


    return {

        total: 0,

        change: 0,

        updatedAt:
            new Date().toISOString()

    };

};


export function useRealTimeData(
    endpoint,
    options = {}
) {

    const {

        enableRealTime =
        false,

        wsUrl =
        "ws://localhost:8080"

    } = options;


    const [
        data,
        setData
    ] =
        useState(null);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    const [
        error,
        setError
    ] =
        useState(null);


    const [
        isConnected,
        setIsConnected
    ] =
        useState(false);


    const [
        isRefreshing,
        setIsRefreshing
    ] =
        useState(false);


    const lastUpdateRef =
        useRef(null);


    const apiService =
        useApiService();


    const wsService =
        useWebSocket(wsUrl);


    const fetchInitialData =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    /*
                     * There is no Day 5 backend in this
                     * training repository, so local
                     * demo data represents the API response.
                     */

                    const result =
                        createDemoData(
                            endpoint
                        );


                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                350
                            )
                    );


                    setData(result);

                    setError(null);

                    lastUpdateRef.current =
                        Date.now();

                } catch (err) {

                    setError(
                        err.message
                    );

                } finally {

                    setLoading(false);

                }

            },
            [endpoint]
        );


    useEffect(() => {

        fetchInitialData();

    }, [
        fetchInitialData
    ]);


    useEffect(() => {

        if (
            !enableRealTime
        ) {

            return undefined;

        }


        wsService.connect();


        const unsubscribeConnected =
            wsService.subscribe(
                "connected",
                () => {

                    setIsConnected(
                        true
                    );

                }
            );


        const unsubscribeDisconnected =
            wsService.subscribe(
                "disconnected",
                () => {

                    setIsConnected(
                        false
                    );

                }
            );


        const unsubscribeMessage =
            wsService.subscribe(
                "message",
                message => {

                    if (
                        message.type !==
                        "dataUpdate"
                    ) {

                        return;

                    }


                    if (
                        message.payload
                            ?.endpoint !==
                        endpoint
                    ) {

                        return;

                    }


                    setData(
                        previous => ({

                            ...
                            previous,

                            ...
                            message.payload
                                .data,

                            updatedAt:
                                new Date()
                                    .toISOString()

                        })
                    );


                    lastUpdateRef.current =
                        Date.now();

                }
            );


        return () => {

            unsubscribeConnected();

            unsubscribeDisconnected();

            unsubscribeMessage();

            wsService.disconnect();

        };

    }, [
        endpoint,
        enableRealTime,
        wsService
    ]);


    const refresh =
        useCallback(
            async () => {

                try {

                    setIsRefreshing(
                        true
                    );


                    setError(null);


                    const freshData =
                        createDemoData(
                            endpoint
                        );


                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                300
                            )
                    );


                    setData(
                        freshData
                    );


                    lastUpdateRef.current =
                        Date.now();

                } catch (err) {

                    setError(
                        err.message
                    );

                } finally {

                    setIsRefreshing(
                        false
                    );

                }

            },
            [endpoint]
        );


    const getLastUpdate =
        useCallback(
            () => {

                return (
                    lastUpdateRef.current
                );

            },
            []
        );


    const simulateLiveUpdate =
        useCallback(
            () => {

                const updated =
                    createDemoData(
                        endpoint
                    );


                setData(
                    updated
                );


                lastUpdateRef.current =
                    Date.now();


                if (
                    isConnected
                ) {

                    wsService.send({

                        type:
                            "dataUpdate",

                        payload: {

                            endpoint,

                            data:
                                updated

                        }

                    });

                }

            },
            [
                endpoint,
                isConnected,
                wsService
            ]
        );


    return {

        data,

        loading,

        error,

        isConnected,

        isRefreshing,

        refresh,

        reconnect: () => {
            wsService.connect();
        },

        disconnect: () => {
            wsService.disconnect();
        },

        getLastUpdate,

        simulateLiveUpdate

    };

}