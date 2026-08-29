import {
    createContext,
    useCallback,
    useContext,
    useReducer
} from "react";

const DataContext = createContext(null);

const initialState = {
    loading: false,
    error: null,
    data: {
        users: [],
        revenue: [],
        orders: []
    }
};

function dataReducer(state, action) {

    switch (action.type) {

        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case "SET_DATA":
            return {
                ...state,
                data: action.payload,
                loading: false,
                error: null
            };

        default:
            return state;
    }
}

const createMockData = () => ({

    users: Array.from(
        { length: 7 },
        () =>
            Math.floor(
                Math.random() * 600
            ) + 300
    ),


    revenue: Array.from(
        { length: 7 },
        () =>
            Math.floor(
                Math.random() * 4000
            ) + 1500
    ),


    orders: Array.from(
        { length: 7 },
        () =>
            Math.floor(
                Math.random() * 250
            ) + 80
    )

});

export function DataProvider({ children }) {

    const [state, dispatch] =
        useReducer(
            dataReducer,
            initialState
        );


    const fetchData = useCallback(
        async () => {

            dispatch({
                type: "SET_LOADING",
                payload: true
            });


            try {

                await new Promise(resolve =>
                    setTimeout(resolve, 500)
                );


                const data =
                    createMockData();


                dispatch({
                    type: "SET_DATA",
                    payload: data
                });


                return data;

            } catch (error) {

                dispatch({
                    type: "SET_ERROR",
                    payload: error.message
                });

                throw error;

            }

        },
        []
    );


    const clearCache = useCallback(() => {

        dispatch({
            type: "SET_DATA",
            payload: {
                users: [],
                revenue: [],
                orders: []
            }
        });

    }, []);


    const value = {
        data: state.data,
        loading: state.loading,
        error: state.error,
        fetchData,
        clearCache
    };


    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}


export function useDataContext() {

    const context =
        useContext(DataContext);


    if (!context) {

        throw new Error(
            "useDataContext must be used inside DataProvider"
        );

    }


    return context;
}


export { DataContext };