import { DataManager }
    from "./modules/DataManager.js";

import { ChartManager }
    from "./modules/ChartManager.js";

import { PerformanceMonitor }
    from "./modules/PerformanceMonitor.js";


class DashboardApp {

    constructor() {

        this.dataManager =
            new DataManager();

        this.chartManager =
            null;

        this.performanceMonitor =
            new PerformanceMonitor();

        this.init();

    }


    async init() {

        try {

            this.setupEventListeners();

            this.startPerformanceMonitoring();

            await this.initializeCharts();

        } catch (error) {

            console.error(
                "Application initialization error:",
                error
            );

            this.showError(
                "Failed to initialize dashboard."
            );

        }

    }


    async initializeCharts() {

        this.chartManager =
            new ChartManager(
                "charts-grid",
                this.dataManager
            );


        await this.chartManager.init();

    }


    setupEventListeners() {

        const refreshButton =
            document.getElementById(
                "refreshBtn"
            );


        const monitorButton =
            document.getElementById(
                "monitorBtn"
            );


        refreshButton?.addEventListener(
            "click",
            () => this.refreshData()
        );


        monitorButton?.addEventListener(
            "click",
            () =>
                this.togglePerformanceMonitor()
        );

    }


    async refreshData() {

        this.dataManager.clearCache();

        await this.chartManager?.createCharts();

    }


    togglePerformanceMonitor() {

        const panel =
            document.getElementById(
                "performance-panel"
            );


        const status =
            document.getElementById(
                "monitor-status"
            );


        const hidden =
            panel.style.display === "none";


        panel.style.display =
            hidden
                ? "block"
                : "none";


        status.textContent =
            hidden
                ? "Active"
                : "Paused";

    }


    startPerformanceMonitoring() {

        this.performanceMonitor.subscribe(
            metric => {

                this.updatePerformanceDisplay(
                    metric
                );

            }
        );

    }


   updatePerformanceDisplay(metric) {

    const container =
        document.getElementById(
            "performance-metrics"
        );

    if (!container) {
        return;
    }


    // Remove the initial loading message
    const emptyState =
        container.querySelector(
            ".empty-state"
        );

    if (emptyState) {
        emptyState.remove();
    }


    // Human-readable names
    const metricNames = {

        "memory-used":
            "Memory Used",

        "memory-total":
            "Memory Total",

        "interaction-count":
            "Interactions",

        "LCP":
            "Largest Contentful Paint",

        "FID":
            "First Input Delay",

        "CLS":
            "Cumulative Layout Shift"

    };


    // Format values for display
    let displayValue = metric.value;


    if (
        metric.name === "memory-used" ||
        metric.name === "memory-total"
    ) {

        displayValue =
            `${(
                metric.value /
                (1024 * 1024)
            ).toFixed(2)} MB`;

    }


    else if (
        metric.name === "LCP"
    ) {

        displayValue =
            `${(
                metric.value / 1000
            ).toFixed(2)} s`;

    }


    else if (
        metric.name === "FID"
    ) {

        displayValue =
            `${metric.value.toFixed(2)} ms`;

    }


    else if (
        metric.name === "CLS"
    ) {

        displayValue =
            metric.value.toFixed(3);

    }


    else if (
        metric.name === "interaction-count"
    ) {

        displayValue =
            Math.round(metric.value);

    }


    // Find existing metric card
    let item =
        container.querySelector(
            `[data-metric="${metric.name}"]`
        );


    // Create card if it doesn't exist
    if (!item) {

        item =
            document.createElement("div");

        item.className =
            "metric-item";

        item.dataset.metric =
            metric.name;

        item.innerHTML = `

            <span class="metric-name"></span>

            <span class="metric-value"></span>

            <span class="metric-time"></span>

        `;

        container.appendChild(item);

    }


    // Update card
    item.querySelector(
        ".metric-name"
    ).textContent =
        metricNames[metric.name] ||
        metric.name;


    item.querySelector(
        ".metric-value"
    ).textContent =
        displayValue;


    item.querySelector(
        ".metric-time"
    ).textContent =
        new Date(
            metric.timestamp
        ).toLocaleTimeString();

}


    showError(message) {

        const container =
            document.getElementById(
                "error-container"
            );


        container.innerHTML = `

            <div class="error-message">

                <h2>
                    Dashboard Error
                </h2>

                <p>
                    ${message}
                </p>

                <button
                    onclick="location.reload()"
                    class="button"
                >
                    Reload Page
                </button>

            </div>

        `;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        new DashboardApp();

    }
);