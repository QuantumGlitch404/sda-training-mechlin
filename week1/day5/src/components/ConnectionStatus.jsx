import {
    useEffect,
    useState
} from "react";


export default function ConnectionStatus({
    status,
    lastUpdate,
    onReconnect
}) {

    const [
        showDetails,
        setShowDetails
    ] =
        useState(false);


    const [
        lastConnected,
        setLastConnected
    ] =
        useState(lastUpdate);


    useEffect(() => {

        if (
            status === "connected"
        ) {

            setLastConnected(
                new Date()
            );

        }

    }, [status]);


    const statusInfo = {

        connected: {

            icon: "●",

            text: "Connected",

            description:
                "Real-time connection is active."

        },


        partial: {

            icon: "●",

            text: "Partial",

            description:
                "Some services are connected."

        },


        disconnected: {

            icon: "●",

            text: "Disconnected",

            description:
                "The WebSocket connection is currently unavailable."

        }

    };


    const info =
        statusInfo[
        status
        ] ||
        statusInfo.disconnected;


    return (

        <div className="connection-status">

            <button
                className={
                    `connection-badge ${status}`
                }
                onClick={() =>
                    setShowDetails(
                        current =>
                            !current
                    )
                }
                type="button"
            >

                <span>
                    {info.icon}
                </span>

                <span>
                    {info.text}
                </span>

            </button>


            {showDetails && (

                <div className="connection-details">

                    <p>
                        {info.description}
                    </p>


                    {lastConnected && (

                        <p>
                            Last connection:
                            {" "}
                            {new Date(
                                lastConnected
                            ).toLocaleTimeString()}
                        </p>

                    )}


                    {status ===
                        "disconnected" && (

                            <button
                                className="small-button"
                                onClick={
                                    onReconnect
                                }
                            >
                                Reconnect
                            </button>

                        )}

                </div>

            )}

        </div>

    );

}