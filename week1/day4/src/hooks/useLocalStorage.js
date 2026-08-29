import {
    useEffect,
    useState
} from "react";


export function useLocalStorage(
    key,
    initialValue
) {

    const [storedValue, setStoredValue] =
        useState(() => {

            try {

                const item =
                    window.localStorage.getItem(
                        key
                    );

                return item
                    ? JSON.parse(item)
                    : initialValue;

            } catch (error) {

                console.error(
                    "LocalStorage read error:",
                    error
                );

                return initialValue;
            }

        });


    const setValue = value => {

        try {

            const valueToStore =
                value instanceof Function
                    ? value(storedValue)
                    : value;


            setStoredValue(
                valueToStore
            );

        } catch (error) {

            console.error(
                "LocalStorage write error:",
                error
            );

        }

    };


    useEffect(() => {

        window.localStorage.setItem(
            key,
            JSON.stringify(storedValue)
        );

    }, [key, storedValue]);


    return [
        storedValue,
        setValue
    ];
}