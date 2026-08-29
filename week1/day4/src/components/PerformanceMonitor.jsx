import {
    memo,
    useMemo
} from "react";

import { usePerformance }
    from "../hooks/usePerformance";


const PerformanceMonitor = memo(
    function PerformanceMonitor() {

        const metrics =
            usePerformance();


        const formattedMetrics =
            useMemo(() => ({

                loadTime:
                    `${metrics.loadTime?.toFixed(0) || 0} ms`,

                domContentLoaded:
                    `${metrics.domContentLoaded?.toFixed(0) || 0} ms`,

                firstPaint:
                    `${metrics.firstPaint?.toFixed(0) || 0} ms`,

                firstContentfulPaint:
                    `${metrics.firstContentfulPaint?.toFixed(0) || 0} ms`

            }), [metrics]);


        return (

            <section className="performance-panel">

                <div className="section-heading">

                    <div>

                        <p className="eyebrow">
                            PERFORMANCE
                        </p>

                        <h2>
                            Browser Metrics
                        </h2>

                    </div>

                    <span className="status">
                        Monitoring
                    </span>

                </div>


                <div className="performance-grid">

                    <div className="performance-item">

                        <span>
                            Load Time
                        </span>

                        <strong>
                            {formattedMetrics.loadTime}
                        </strong>

                    </div>


                    <div className="performance-item">

                        <span>
                            DOM Ready
                        </span>

                        <strong>
                            {formattedMetrics.domContentLoaded}
                        </strong>

                    </div>


                    <div className="performance-item">

                        <span>
                            First Paint
                        </span>

                        <strong>
                            {formattedMetrics.firstPaint}
                        </strong>

                    </div>


                    <div className="performance-item">

                        <span>
                            First Contentful Paint
                        </span>

                        <strong>
                            {formattedMetrics.firstContentfulPaint}
                        </strong>

                    </div>

                </div>

            </section>

        );

    }
);


export default PerformanceMonitor;