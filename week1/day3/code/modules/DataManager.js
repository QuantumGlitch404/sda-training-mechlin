export class DataManager {

    constructor() {
        this.cache = new Map();
        this.subscribers = new Set();
    }


    async fetchData(endpoint, options = {}) {

        const cacheKey =
            `${endpoint}-${JSON.stringify(options)}`;


        // Return cached data when available
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }


        try {

            /*
             * The Mechlin task expects API endpoints.
             * This training project does not have a backend,
             * so we use local demo data.
             */

            const data = this.getMockData(endpoint);


            // Simulate a small network delay
            await new Promise(resolve => {
                setTimeout(resolve, 400);
            });


            this.cache.set(cacheKey, data);

            this.notifySubscribers(
                endpoint,
                data
            );

            return data;

        } catch (error) {

            console.error(
                "Data fetch error:",
                error
            );

            throw error;
        }
    }


   getMockData(endpoint) {

    const labels = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];


    if (endpoint === "/api/users") {

        return {
            labels,

            values: labels.map(() =>
                Math.floor(
                    Math.random() * 300
                ) + 100
            )
        };

    }


    if (endpoint === "/api/revenue") {

        return {
            labels,

            values: labels.map(() =>
                Math.floor(
                    Math.random() * 4000
                ) + 1000
            )
        };

    }


    if (endpoint === "/api/orders") {

        return {

            labels: [
                "Completed",
                "Pending",
                "Cancelled",
                "Refunded"
            ],

            values: [
                Math.floor(
                    Math.random() * 300
                ) + 300,

                Math.floor(
                    Math.random() * 100
                ) + 20,

                Math.floor(
                    Math.random() * 50
                ) + 10,

                Math.floor(
                    Math.random() * 30
                ) + 5
            ]

        };

    }


    throw new Error(
        `Unknown endpoint: ${endpoint}`
    );

}


    subscribe(callback) {

        this.subscribers.add(callback);

        return () => {
            this.subscribers.delete(callback);
        };
    }


    notifySubscribers(endpoint, data) {

        this.subscribers.forEach(
            callback => {
                callback(endpoint, data);
            }
        );

    }


    clearCache() {

        this.cache.clear();

    }
}