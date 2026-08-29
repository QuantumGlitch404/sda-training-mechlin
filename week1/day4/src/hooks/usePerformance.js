import {
    useEffect,
    useState
} from "react";


export function usePerformance() {

    const [metrics, setMetrics] =
        useState({});


    useEffect(() => {

        const updateMetrics = () => {

            if (!("performance" in window)) {
                return;
            }


            const navigation =
                performance.getEntriesByType(
                    "navigation"
                )[0];


            const paintEntries =
                performance.getEntriesByType(
                    "paint"
                );


            const firstPaint =
                paintEntries.find(
                    entry =>
                        entry.name ===
                        "first-paint"
                );


            const firstContentfulPaint =
                paintEntries.find(
                    entry =>
                        entry.name ===
                        "first-contentful-paint"
                );


            setMetrics({

                loadTime:
                    navigation
                        ? navigation.loadEventEnd
                        : 0,

                domContentLoaded:
                    navigation
                        ? navigation.domContentLoadedEventEnd
                        : 0,

                firstPaint:
                    firstPaint?.startTime || 0,

                firstContentfulPaint:
                    firstContentfulPaint
                        ?.startTime || 0

            });

        };


        updateMetrics();


        const interval =
            setInterval(
                updateMetrics,
                5000
            );


        return () =>
            clearInterval(interval);

    }, []);


    return metrics;
}