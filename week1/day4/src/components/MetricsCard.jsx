import {
    memo,
    useMemo
} from "react";

import PropTypes from "prop-types";


const MetricsCard = memo(
    function MetricsCard({
        title,
        value,
        change,
        trend,
        icon,
        onClick
    }) {

        const formattedValue =
            useMemo(() => {

                if (
                    typeof value === "number"
                ) {

                    return value.toLocaleString();

                }

                return value;

            }, [value]);


        const changeClass =
            useMemo(() => {

                if (change > 0) {
                    return "positive";
                }

                if (change < 0) {
                    return "negative";
                }

                return "neutral";

            }, [change]);


        return (

            <article
                className="metric-card"
                onClick={onClick}
            >

                <div className="metric-card-top">

                    <span className="metric-icon">
                        {icon}
                    </span>

                    <span className="metric-title">
                        {title}
                    </span>

                </div>


                <div className="metric-value">
                    {formattedValue}
                </div>


                <div
                    className={
                        `metric-change ${changeClass}`
                    }
                >

                    {change > 0 ? "+" : ""}
                    {change}%

                </div>


                <div className="metric-trend">

                    <span>
                        Trend
                    </span>

                    <strong>
                        {trend}
                    </strong>

                </div>

            </article>

        );

    }
);


MetricsCard.propTypes = {

    title:
        PropTypes.string.isRequired,

    value:
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,

    change:
        PropTypes.number,

    trend:
        PropTypes.string,

    icon:
        PropTypes.string,

    onClick:
        PropTypes.func

};


MetricsCard.defaultProps = {

    change: 0,

    trend: "Stable",

    icon: "•",

    onClick: null

};


export default MetricsCard;