export class PerformanceMonitor {

    constructor() {

        this.metrics =
            new Map();

        this.observers =
            new Set();

        this.init();

    }


    init() {

        this.observePerformance();

        this.observeMemory();

        this.observeUserInteractions();

    }


    observePerformance() {

        if (
            !("PerformanceObserver" in window)
        ) {
            return;
        }


        this.observeLCP();

        this.observeCLS();

        this.observeFID();

    }


    observeLCP() {

        try {

            const observer =
                new PerformanceObserver(
                    list => {

                        const entries =
                            list.getEntries();

                        const lastEntry =
                            entries[
                                entries.length - 1
                            ];


                        if (lastEntry) {

                            this.recordMetric(
                                "LCP",
                                lastEntry.startTime
                            );

                        }

                    }
                );


            observer.observe({
                type:
                    "largest-contentful-paint",
                buffered: true
            });


        } catch (error) {

            console.warn(
                "LCP monitoring unavailable."
            );

        }

    }


    observeCLS() {

        try {

            const observer =
                new PerformanceObserver(
                    list => {

                        list.getEntries()
                            .forEach(entry => {

                                if (
                                    !entry.hadRecentInput
                                ) {

                                    this.recordMetric(
                                        "CLS",
                                        entry.value
                                    );

                                }

                            });

                    }
                );


            observer.observe({
                type: "layout-shift",
                buffered: true
            });


        } catch (error) {

            console.warn(
                "CLS monitoring unavailable."
            );

        }

    }


    observeFID() {

        try {

            const observer =
                new PerformanceObserver(
                    list => {

                        list.getEntries()
                            .forEach(entry => {

                                this.recordMetric(
                                    "FID",
                                    entry.processingStart -
                                    entry.startTime
                                );

                            });

                    }
                );


            observer.observe({
                type: "first-input",
                buffered: true
            });


        } catch (error) {

            console.warn(
                "FID monitoring unavailable."
            );

        }

    }


    observeMemory() {

        if (
            !performance.memory
        ) {
            return;
        }


        setInterval(() => {

            const memory =
                performance.memory;


            this.recordMetric(
                "memory-used",
                memory.usedJSHeapSize
            );


            this.recordMetric(
                "memory-total",
                memory.totalJSHeapSize
            );

        }, 5000);

    }


    observeUserInteractions() {

        let count = 0;


        [
            "click",
            "keydown",
            "scroll",
            "touchstart"
        ].forEach(eventType => {

            document.addEventListener(
                eventType,

                () => {

                    count++;

                    this.recordMetric(
                        "interaction-count",
                        count
                    );

                },

                {
                    passive: true
                }
            );

        });

    }


    recordMetric(name, value) {

        const metric = {

            name,

            value,

            timestamp: Date.now()

        };


        this.metrics.set(
            name,
            metric
        );


        this.notifyObservers(
            metric
        );


        this.storeMetric(
            metric
        );

    }


    getMetric(name) {

        return this.metrics.get(
            name
        );

    }


    getAllMetrics() {

        return Array.from(
            this.metrics.values()
        );

    }


    subscribe(callback) {

        this.observers.add(
            callback
        );


        return () => {

            this.observers.delete(
                callback
            );

        };

    }


    notifyObservers(metric) {

        this.observers.forEach(
            callback => {
                callback(metric);
            }
        );

    }


    storeMetric(metric) {

        const stored =
            JSON.parse(
                localStorage.getItem(
                    "performance-metrics"
                ) || "[]"
            );


        stored.push(metric);


        if (
            stored.length > 100
        ) {

            stored.splice(
                0,
                stored.length - 100
            );

        }


        localStorage.setItem(
            "performance-metrics",
            JSON.stringify(stored)
        );

    }


    getStoredMetrics() {

        return JSON.parse(
            localStorage.getItem(
                "performance-metrics"
            ) || "[]"
        );

    }


    generateReport() {

        const metrics =
            this.getAllMetrics();


        return {

            timestamp:
                Date.now(),

            metrics,

            summary:
                this.generateSummary(
                    metrics
                )

        };

    }


    generateSummary(metrics) {

        const summary = {};


        metrics.forEach(metric => {

            if (
                !summary[metric.name]
            ) {

                summary[metric.name] = {

                    count: 0,

                    total: 0,

                    average: 0,

                    min: Infinity,

                    max: -Infinity

                };

            }


            const stat =
                summary[metric.name];


            stat.count++;

            stat.total += metric.value;

            stat.average =
                stat.total /
                stat.count;

            stat.min =
                Math.min(
                    stat.min,
                    metric.value
                );

            stat.max =
                Math.max(
                    stat.max,
                    metric.value
                );

        });


        return summary;

    }

}