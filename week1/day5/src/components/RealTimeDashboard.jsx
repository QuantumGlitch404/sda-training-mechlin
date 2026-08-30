import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useRealTimeData
} from "../hooks/useRealTimeData";

import ConnectionStatus
    from "./ConnectionStatus";


const metrics = [
    {
        key: "revenue",
        title: "Revenue",
        icon: "$"
    },
    {
        key: "users",
        title: "Users",
        icon: "◎"
    },
    {
        key: "orders",
        title: "Orders",
        icon: "#"
    }
];


export default function RealTimeDashboard() {

    const [
        selectedMetric,
        setSelectedMetric
    ] =
        useState("revenue");


    const [
        autoRefresh,
        setAutoRefresh
    ] =
        useState(true);


    const revenue =
        useRealTimeData(
            "/api/revenue",
            {
                enableRealTime: true
            }
        );


    const users =
        useRealTimeData(
            "/api/users",
            {
                enableRealTime: true
            }
        );


    const orders =
        useRealTimeData(
            "/api/orders",
            {
                enableRealTime: true
            }
        );


    useEffect(() => {

        if (
            !autoRefresh
        ) {

            return undefined;

        }


        const interval =
            setInterval(
                () => {

                    revenue.simulateLiveUpdate();

                    users.simulateLiveUpdate();

                    orders.simulateLiveUpdate();

                },
                5000
            );


        return () =>
            clearInterval(
                interval
            );

    }, [
        autoRefresh
    ]);


    const handleRefreshAll =
        () => {

            revenue.refresh();

            users.refresh();

            orders.refresh();

        };


    const connectionStates = [

        revenue.isConnected,

        users.isConnected,

        orders.isConnected

    ];


    const connectedCount =
        connectionStates.filter(
            Boolean
        ).length;


    const connectionStatus =
        connectedCount === 3
            ? "connected"
            : connectedCount === 0
                ? "disconnected"
                : "partial";


    const selectedData =
        useMemo(() => {

            const map = {

                revenue:
                    revenue.data,

                users:
                    users.data,

                orders:
                    orders.data

            };


            return map[
                selectedMetric
            ];

        }, [
            selectedMetric,
            revenue.data,
            users.data,
            orders.data
        ]);


    const latestUpdate =
        selectedData?.updatedAt;


    return (

        <main className="real-time-dashboard">

            <header className="dashboard-header">

                <div>

                    <p className="eyebrow">
                        API & REAL-TIME DATA
                    </p>

                    <h1>
                        Real-Time Dashboard
                    </h1>

                    <p className="subtitle">
                        REST data, WebSocket updates
                        and live synchronization.
                    </p>

                </div>


                <div className="dashboard-controls">

                    <ConnectionStatus
                        status={
                            connectionStatus
                        }
                        lastUpdate={
                            latestUpdate
                        }
                        onReconnect={() => {

                            revenue.reconnect();

                            users.reconnect();

                            orders.reconnect();

                        }}
                    />


                    <button
                        className="button secondary"
                        onClick={() =>
                            setAutoRefresh(
                                current =>
                                    !current
                            )
                        }
                    >

                        {autoRefresh
                            ? "Auto Refresh: ON"
                            : "Auto Refresh: OFF"}

                    </button>


                    <button
                        className="button"
                        onClick={
                            handleRefreshAll
                        }
                    >
                        Refresh All
                    </button>

                </div>

            </header>


            <section className="metrics-grid">

                {metrics.map(
                    metric => {

                        const source =
                            metric.key ===
                                "revenue"
                                ? revenue
                                : metric.key ===
                                    "users"
                                    ? users
                                    : orders;


                        return (

                            <article
                                key={
                                    metric.key
                                }

                                className={
                                    `metric-card ${selectedMetric ===
                                        metric.key
                                        ? "selected"
                                        : ""
                                    }`
                                }

                                onClick={() =>
                                    setSelectedMetric(
                                        metric.key
                                    )
                                }
                            >

                                <div className="metric-card-top">

                                    <span className="metric-icon">
                                        {metric.icon}
                                    </span>

                                    <span className="metric-title">
                                        {metric.title}
                                    </span>

                                    {source.isConnected && (

                                        <span
                                            className="live-dot"
                                            title="Live"
                                        >
                                            LIVE
                                        </span>

                                    )}

                                </div>


                                <strong className="metric-value">

                                    {source.loading
                                        ? "Loading..."
                                        : source.data?.total
                                            ? source.data.total.toLocaleString()
                                            : "0"}

                                </strong>


                                <div className="metric-change positive">

                                    +
                                    {source.data?.change ?? 0}%

                                    <span>
                                        updated live
                                    </span>

                                </div>

                            </article>

                        );

                    }
                )}

            </section>


            <section className="data-panel">

                <div className="section-heading">

                    <div>

                        <p className="eyebrow">
                            LIVE DATA
                        </p>

                        <h2>
                            {selectedMetric
                                .charAt(0)
                                .toUpperCase() +
                                selectedMetric.slice(1)}
                            {" "}
                            Updates
                        </h2>

                    </div>


                    <span className="last-update">

                        {latestUpdate
                            ? `Updated ${new Date(
                                latestUpdate
                            ).toLocaleTimeString()}`
                            : "Waiting for data"}

                    </span>

                </div>


                <div className="live-chart">

                    <div className="chart-lines">

                        {Array.from(
                            {
                                length: 12
                            }
                        ).map(
                            (_, index) => (

                                <span
                                    key={
                                        index
                                    }
                                ></span>

                            )
                        )}

                    </div>


                    <div className="live-bars">

                        {Array.from(
                            {
                                length: 12
                            }
                        ).map(
                            (_, index) => (

                                <span
                                    key={
                                        index
                                    }

                                    style={{
                                        height:
                                            `${30 + (
                                                (index * 17 +
                                                    (
                                                        selectedData?.total ??
                                                        200
                                                    ) %
                                                    55
                                                ) %
                                                65)}%`
                                    }}
                                ></span>

                            )
                        )}

                    </div>

                </div>

            </section>


            <section className="updates-panel">

                <div className="section-heading">

                    <div>

                        <p className="eyebrow">
                            STREAM
                        </p>

                        <h2>
                            Real-Time Events
                        </h2>

                    </div>

                    <span className="status">
                        {connectedCount}/3 connected
                    </span>

                </div>


                <div className="event-list">

                    <div className="event-item">

                        <span className="event-dot">
                            ●
                        </span>

                        <div>

                            <strong>
                                Revenue service
                            </strong>

                            <p>
                                Live data channel
                                {revenue.isConnected
                                    ? " connected"
                                    : " disconnected"}
                            </p>

                        </div>

                    </div>


                    <div className="event-item">

                        <span className="event-dot">
                            ●
                        </span>

                        <div>

                            <strong>
                                User service
                            </strong>

                            <p>
                                Live data channel
                                {users.isConnected
                                    ? " connected"
                                    : " disconnected"}
                            </p>

                        </div>

                    </div>


                    <div className="event-item">

                        <span className="event-dot">
                            ●
                        </span>

                        <div>

                            <strong>
                                Order service
                            </strong>

                            <p>
                                Live data channel
                                {orders.isConnected
                                    ? " connected"
                                    : " disconnected"}
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </main>

    );

}