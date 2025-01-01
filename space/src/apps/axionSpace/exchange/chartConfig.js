import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const createGradient = (ctx, chartArea, color1, color2) => {
    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
};

const FuturisticDonutChart = ({ data, labels }) => {
    const options = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: "#00FFAA",
                    font: {
                        family: "Orbitron",
                        size: 16,
                    },
                },
            },
            tooltip: {
                backgroundColor: "rgba(20, 20, 20, 0.8)",
                titleColor: "#00FFFF",
                bodyColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#00FFFF",
            },
        },
        elements: {
            arc: {
                borderWidth: 2,
                hoverBorderWidth: 4,
                hoverBorderColor: "rgba(255, 255, 255, 0.8)",
            },
        },
        maintainAspectRatio: false,
    };

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Impact Metrics",
                data: data,
                backgroundColor: (context) => {
                    const { ctx, chartArea } = context.chart;
                    if (!chartArea) return; // Wait for chart area to be available
                    return [
                        createGradient(ctx, chartArea, "rgb(0, 255, 255)", "rgb(0, 91, 255)"),
                        createGradient(ctx, chartArea, "rgb(255, 0, 127)", "rgb(138, 43, 226)"),
                        createGradient(ctx, chartArea, "rgb(173, 255, 47)", "rgb(255, 255, 0)"),
                    ];
                },
                hoverBackgroundColor: ["#33CCFF", "#FF33AA", "#DFFF3F"],
                borderWidth: 1,
                hoverBorderWidth: 3,
            },
        ],
    };

    return <Doughnut data={chartData} options={options} />;
};

export default FuturisticDonutChart;
