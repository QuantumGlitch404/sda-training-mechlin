import {
    useMemo
} from "react";

import ApiService
    from "../services/ApiService";


export function useApiService() {

    return useMemo(
        () => {

            return new ApiService(
                "",
                {
                    retryAttempts: 3,

                    retryDelay: 800,

                    timeout: 8000
                }
            );

        },
        []
    );

}