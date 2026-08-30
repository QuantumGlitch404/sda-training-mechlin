import { WebSocketServer } from "ws";

const PORT = 8080;

const wss = new WebSocketServer({
    port: PORT
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on("connection", (socket) => {

    console.log("Client connected");

    socket.send(
        JSON.stringify({
            type: "connected",
            payload: {
                message: "Local WebSocket connected"
            }
        })
    );

    const interval = setInterval(() => {

        const updates = [

            {
                endpoint: "/api/revenue",
                data: {
                    total:
                        Math.floor(
                            Math.random() * 40000
                        ) + 20000,
                    change:
                        Number(
                            (
                                Math.random() * 15
                            ).toFixed(1)
                        ),
                    updatedAt:
                        new Date().toISOString()
                }
            },

            {
                endpoint: "/api/users",
                data: {
                    total:
                        Math.floor(
                            Math.random() * 2000
                        ) + 1000,
                    change:
                        Number(
                            (
                                Math.random() * 12
                            ).toFixed(1)
                        ),
                    updatedAt:
                        new Date().toISOString()
                }
            },

            {
                endpoint: "/api/orders",
                data: {
                    total:
                        Math.floor(
                            Math.random() * 1000
                        ) + 500,
                    change:
                        Number(
                            (
                                Math.random() * 18
                            ).toFixed(1)
                        ),
                    updatedAt:
                        new Date().toISOString()
                }
            }

        ];


        const update =
            updates[
                Math.floor(
                    Math.random() *
                    updates.length
                )
            ];


        socket.send(
            JSON.stringify({
                type: "dataUpdate",
                payload: update
            })
        );

    }, 3000);


    socket.on("message", (message) => {

        try {

            const data =
                JSON.parse(message.toString());


            if (data.type === "ping") {

                socket.send(
                    JSON.stringify({
                        type: "pong"
                    })
                );

            }

        } catch (error) {

            console.error(
                "Message parsing error:",
                error
            );

        }

    });


    socket.on("close", () => {

        console.log("Client disconnected");

        clearInterval(interval);

    });


    socket.on("error", (error) => {

        console.error(
            "WebSocket error:",
            error
        );

        clearInterval(interval);

    });

});