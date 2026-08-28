import { DataManager } from "./DataManager.js";


export class ChartManager {

    constructor(containerId, dataManager) {

        this.container =
            document.getElementById(containerId);

        this.dataManager =
            dataManager;

        this.charts =
            new Map();

    }


    async init() {

        await this.loadChartLibrary();

        this.setupEventListeners();

        await this.createCharts();

    }


    async loadChartLibrary() {

        if (window.Chart) {
            return;
        }


        return new Promise(
            (resolve, reject) => {

                const script =
                    document.createElement("script");

                script.src =
                    "https://cdn.jsdelivr.net/npm/chart.js";

                script.onload = resolve;

                script.onerror = reject;

                document.head.appendChild(
                    script
                );

            }
        );

    }


    async createCharts() {

        this.destroyCharts();

        try {

            const [
                userData,
                revenueData,
                orderData
            ] = await Promise.all([

                this.dataManager.fetchData(
                    "/api/users"
                ),

                this.dataManager.fetchData(
                    "/api/revenue"
                ),

                this.dataManager.fetchData(
                    "/api/orders"
                )

            ]);


            this.createLineChart(
                "revenueChart",
                revenueData
            );


            this.createBarChart(
                "userChart",
                userData
            );


            this.createDoughnutChart(
                "orderChart",
                orderData
            );


            this.createMixedChart(
                "performanceChart",
                {
                    userData,
                    revenueData,
                    orderData
                }
            );

        } catch (error) {

            console.error(
                "Chart creation error:",
                error
            );

            this.showError(
                "Failed to load chart data."
            );

        }

    }


    createLineChart(canvasId, data) {

        const canvas =
            document.getElementById(canvasId);

        if (!canvas) {
            return;
        }


        const ctx =
            canvas.getContext("2d");


        this.charts.set(

            canvasId,

            new Chart(ctx, {

                type: "line",

                data: {

                    labels: data.labels,

                    datasets: [
                        {
                            label: "Revenue",

                            data: data.values,

                            borderColor: "#f5f5f5",

                            backgroundColor:
                                "rgba(245,245,245,0.06)",

                            tension: 0.4,

                            fill: true
                        }
                    ]

                },

                options: this.commonChartOptions()

            })

        );

    }


    createBarChart(canvasId, data) {

        const canvas =
            document.getElementById(canvasId);

        if (!canvas) {
            return;
        }


        const ctx =
            canvas.getContext("2d");


        this.charts.set(

            canvasId,

            new Chart(ctx, {

                type: "bar",

                data: {

                    labels: data.labels,

                    datasets: [
                        {
                            label: "Users",

                            data: data.values,

                            backgroundColor: "#777777"
                        }
                    ]

                },

                options: this.commonChartOptions()

            })

        );

    }


    createDoughnutChart(canvasId, data) {

        const canvas =
            document.getElementById(canvasId);

        if (!canvas) {
            return;
        }


        const ctx =
            canvas.getContext("2d");


        this.charts.set(

            canvasId,

            new Chart(ctx, {

                type: "doughnut",

                data: {

                    labels: data.labels,

                    datasets: [
                        {
                            data: data.values,

                            backgroundColor: [
                                "#f5f5f5",
                                "#9a9a9a",
                                "#555555",
                                "#2b2b2b"
                            ],

                            borderColor: "#0d0d0d",

                            borderWidth: 2
                        }
                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {
                                color: "#a0a0a0"
                            }

                        }

                    }

                }

            })

        );

    }


    createMixedChart(canvasId, data) {

        const canvas =
            document.getElementById(canvasId);

        if (!canvas) {
            return;
        }


        const ctx =
            canvas.getContext("2d");


        this.charts.set(

            canvasId,

            new Chart(ctx, {

                type: "line",

                data: {

                    labels:
                        data.userData.labels,

                    datasets: [

                        {
                            label: "Users",

                            data:
                                data.userData.values,

                            type: "bar",

                            backgroundColor: "#555555",

                            yAxisID: "y"
                        },

                        {
                            label: "Revenue",

                            data:
                                data.revenueData.values,

                            type: "line",

                            borderColor: "#f5f5f5",

                            backgroundColor:
                                "rgba(245,245,245,0.05)",

                            tension: 0.4,

                            yAxisID: "y1"
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {
                                color: "#666666"
                            },

                            grid: {
                                color: "#1d1d1d"
                            }

                        },

                        y1: {

                            beginAtZero: true,

                            position: "right",

                            ticks: {
                                color: "#666666"
                            },

                            grid: {
                                drawOnChartArea: false
                            }

                        },

                        x: {

                            ticks: {
                                color: "#666666"
                            }

                        }

                    }

                }

            })

        );

    }


    commonChartOptions() {

        return {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        color: "#666666"
                    },

                    grid: {
                        color: "#1d1d1d"
                    }

                },

                x: {

                    ticks: {
                        color: "#666666"
                    },

                    grid: {
                        display: false
                    }

                }

            },

            animation: {

                duration: 1200

            }

        };

    }

    destroyCharts() {

    this.charts.forEach(chart => {
        chart.destroy();
    });

    this.charts.clear();

}


    setupEventListeners() {

        this.dataManager.subscribe(
            (endpoint, data) => {

                this.updateCharts(
                    endpoint,
                    data
                );

            }
        );


        window.addEventListener(

            "resize",

            this.debounce(
                () => {

                    this.charts.forEach(
                        chart => {
                            chart.resize();
                        }
                    );

                },
                250
            )

        );

    }


    updateCharts(endpoint, data) {

        switch (endpoint) {

            case "/api/users":

                this.updateChart(
                    "userChart",
                    data
                );

                break;


            case "/api/revenue":

                this.updateChart(
                    "revenueChart",
                    data
                );

                break;


            case "/api/orders":

                this.updateChart(
                    "orderChart",
                    data
                );

                break;

        }

    }


    updateChart(chartId, data) {

        const chart =
            this.charts.get(chartId);


        if (!chart) {
            return;
        }


        chart.data.labels =
            data.labels;

        chart.data.datasets[0].data =
            data.values;

        chart.update();

    }


    showError(message) {

        this.container.innerHTML = `

            <div class="error-message">

                <h3>
                    Error Loading Charts
                </h3>

                <p>
                    ${message}
                </p>

            </div>

        `;

    }


    debounce(func, wait) {

        let timeout;


        return (...args) => {

            clearTimeout(timeout);


            timeout = setTimeout(
                () => func(...args),
                wait
            );

        };

    }

}