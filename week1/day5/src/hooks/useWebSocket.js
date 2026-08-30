import {
    useMemo
} from "react";

import WebSocketService
    from "../services/WebSocketService";


export function useWebSocket(
    url
) {

    return useMemo(
        () => {

            return new WebSocketService(
                url
            );

        },
        [url]
    );

}