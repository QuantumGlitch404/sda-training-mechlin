import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState
} from "react";

import {
    useDataContext
} from "../contexts/DataContext";

import MetricsCard
    from "./MetricsCard";

import PerformanceMonitor
    from "./PerformanceMonitor";

import ErrorBoundary
    from "./ErrorBoundary";


const initialState = {

    loading: false,

    error: null,

    filters: {

        dateRange: "30d",

        category: "all"

    }

};


function dashboardReducer(
    state,
    action
) {

    switch (action.type) {

        case "SET_LOADING":

            return {
                ...state,
                loading: action.payload
            };


        case "SET_ERROR":

            return {

                ...state,

                error:
                    action.payload,

                loading: false

            };


        case "UPDATE_FILTER":

            return {

                ...state,

                filters: {

                    ...state.filters,

                    ...action.payload

                }

            };


        default:

            return state;

    }

}


export default function Dashboard() {

    const [
        state,
        dispatch
    ] =
        useReducer(
            dashboardReducer,
            initialState
        );


    const [
        selectedMetric,
        setSelectedMetric
    ] =
        useState("revenue");


    const [
        viewMode,
        setViewMode
    ] =
        useState("grid");


    const {
        data,
        loading,
        error,
        fetchData
    } =
        useDataContext();


    /*
     * Load data when dashboard opens
     */
    useEffect(() => {

        handleRefresh();

    }, []);


    /*
     * Refresh dashboard data
     */
    const handleRefresh =
        useCallback(async () => {

            dispatch({

                type: "SET_LOADING",

                payload: true

            });


            try {

                await fetchData();

                dispatch({

                    type: "SET_LOADING",

                    payload: false

                });

            } catch (err) {

                dispatch({

                    type: "SET_ERROR",

                    payload: err.message

                });

            }

        }, [fetchData]);


    /*
     * Change filters
     */
    const handleFilterChange =
        useCallback(
            (type, value) => {

                dispatch({

                    type: "UPDATE_FILTER",

                    payload: {

                        [type]: value

                    }

                });


                /*
                 * Category changes the selected metric too.
                 */
                if (
                    type === "category" &&
                    value !== "all"
                ) {

                    setSelectedMetric(
                        value
                    );

                }

            },
            []
        );


    /*
     * Calculate totals
     */
    const totalUsers =
        useMemo(() => {

            return data.users.reduce(
                (total, value) =>
                    total + value,
                0
            );

        }, [data.users]);


    const totalRevenue =
        useMemo(() => {

            return data.revenue.reduce(
                (total, value) =>
                    total + value,
                0
            );

        }, [data.revenue]);


    const totalOrders =
        useMemo(() => {

            return data.orders.reduce(
                (total, value) =>
                    total + value,
                0
            );

        }, [data.orders]);


    /*
     * Select the currently active dataset
     */
    const selectedData =
        useMemo(() => {

            return data[
                selectedMetric
            ] || [];

        }, [
            data,
            selectedMetric
        ]);


    /*
     * Apply Date Range
     */
    const visibleData =
        useMemo(() => {

            let count = 7;


            if (
                state.filters.dateRange === "7d"
            ) {

                count = 7;

            }


            if (
                state.filters.dateRange === "30d"
            ) {

                count = 7;

            }


            if (
                state.filters.dateRange === "90d"
            ) {

                count = 7;

            }


            return selectedData.slice(
                0,
                count
            );

        }, [
            selectedData,
            state.filters.dateRange
        ]);


    /*
     * Format displayed values
     */
    const formatValue =
        useCallback(
            value => {

                if (
                    selectedMetric === "revenue"
                ) {

                    return `$${value.toLocaleString()}`;

                }


                return value.toLocaleString();

            },
            [selectedMetric]
        );


    /*
     * Loading / error state
     */
    if (
        state.error ||
        error
    ) {

        return (

            <div className="error-container">

                <h2>
                    Error Loading Dashboard
                </h2>

                <p>
                    {state.error || error}
                </p>

                <button
                    className="button"
                    onClick={handleRefresh}
                >
                    Try Again
                </button>

            </div>

        );

    }


    return (

        <ErrorBoundary>

            <div className="dashboard">

                {/* Header */}

                <header className="dashboard-header">

                    <div>

                        <p className="eyebrow">
                            REACT ADVANCED
                        </p>

                        <h1>
                            Developer Dashboard
                        </h1>

                        <p className="subtitle">
                            Hooks, state management
                            and optimized components.
                        </p>

                    </div>


                    <div className="header-actions">

                        <button
                            className="button secondary"
                            onClick={() =>
                                setViewMode(
                                    current =>
                                        current === "grid"
                                            ? "compact"
                                            : "grid"
                                )
                            }
                        >

                            {viewMode === "grid"
                                ? "Compact View"
                                : "Grid View"}

                        </button>


                        <button
                            className="button"
                            onClick={handleRefresh}
                            disabled={
                                loading ||
                                state.loading
                            }
                        >

                            {loading ||
                            state.loading
                                ? "Refreshing..."
                                : "Refresh Data"}

                        </button>

                    </div>

                </header>


                {/* Filters */}

                <section className="filter-bar">

                    <div className="filter-group">

                        <label>
                            Date Range
                        </label>

                        <select
                            value={
                                state.filters.dateRange
                            }
                            onChange={event =>
                                handleFilterChange(
                                    "dateRange",
                                    event.target.value
                                )
                            }
                        >

                            <option value="7d">
                                Last 7 days
                            </option>

                            <option value="30d">
                                Last 30 days
                            </option>

                            <option value="90d">
                                Last 90 days
                            </option>

                        </select>

                    </div>


                    <div className="filter-group">

                        <label>
                            Category
                        </label>

                        <select
                            value={
                                state.filters.category
                            }
                            onChange={event =>
                                handleFilterChange(
                                    "category",
                                    event.target.value
                                )
                            }
                        >

                            <option value="all">
                                All
                            </option>

                            <option value="users">
                                Users
                            </option>

                            <option value="revenue">
                                Revenue
                            </option>

                            <option value="orders">
                                Orders
                            </option>

                        </select>

                    </div>


                    <div className="selected-metric">

                        <span>
                            Selected Metric
                        </span>

                        <strong>
                            {selectedMetric}
                        </strong>

                    </div>

                </section>


                {/* Metric cards */}

                <section className="metrics-grid">

                    <MetricsCard
                        title="Total Users"
                        value={totalUsers}
                        change={12.5}
                        trend="Growing"
                        icon="◎"
                        onClick={() =>
                            setSelectedMetric(
                                "users"
                            )
                        }
                    />


                    <MetricsCard
                        title="Revenue"
                        value={
                            `$${totalRevenue.toLocaleString()}`
                        }
                        change={8.2}
                        trend="Positive"
                        icon="$"
                        onClick={() =>
                            setSelectedMetric(
                                "revenue"
                            )
                        }
                    />


                    <MetricsCard
                        title="Orders"
                        value={totalOrders}
                        change={15.3}
                        trend="Strong"
                        icon="#"
                        onClick={() =>
                            setSelectedMetric(
                                "orders"
                            )
                        }
                    />

                </section>


                {/* Activity */}

                <section className="data-panel">

                    <div className="section-heading">

                        <div>

                            <p className="eyebrow">
                                DATA FLOW
                            </p>

                            <h2>
                                Activity Overview
                            </h2>

                        </div>

                    </div>


                    <div
                        className={
                            `data-view ${viewMode}`
                        }
                    >

                        {visibleData.map(
                            (value, index) => (

                                <div
                                    key={index}
                                    className="data-row"
                                >

                                    <span>
                                        Day {index + 1}
                                    </span>


                                    <div className="bar-track">

                                        <span
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        (value /
                                                            Math.max(
                                                                ...visibleData
                                                            )
                                                        ) * 100,
                                                        100
                                                    )}%`
                                            }}
                                        ></span>

                                    </div>


                                    <strong>
                                        {formatValue(value)}
                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                </section>


                {/* Performance */}

                <PerformanceMonitor />

            </div>

        </ErrorBoundary>

    );

}