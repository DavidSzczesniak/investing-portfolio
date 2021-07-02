import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { geckoAPI } from '../constants.js';
import '../css/Sparkline.css';

const Sparkline = (props) => {
    const { asset, priceChangePositive } = props;
    const [assetPrices, setPrices] = useState(null);
    const [assetTimestamps, setTimestamps] = useState(null);

    useEffect(() => {
        async function getMarketChart() {
            await axios
                .get(`${geckoAPI}coins/${asset.id}/market_chart?vs_currency=usd&days=1`)
                .then((res) => {
                    let timestamps = [];
                    let prices = [];
                    res.data.prices.forEach((price) => {
                        timestamps.push(
                            new Date(price[0]).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                        );
                        prices.push(price[1]);
                    });

                    setPrices(prices);
                    setTimestamps(timestamps);
                });
        }
        getMarketChart();
    }, [asset.id]);

    const data = {
        labels: assetTimestamps,
        datasets: [
            {
                data: assetPrices,
                borderWidth: 3,
                borderColor: priceChangePositive ? '#16c784' : '#ea3943',
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        elements: {
            point: {
                radius: 0,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                usePointStyle: true,
                titleFont: {
                    size: 16,
                    family: "'Poppins', sans-serif",
                },
                bodyFont: {
                    size: 16,
                    family: "'Poppins', sans-serif",
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    beginAtZero: true,
                    font: {
                        size: 14,
                        weight: 'bold',
                        family: "'Poppins', sans-serif",
                    },
                    callback: function (val, index) {
                        // Hide the label of every 2nd dataset
                        return index % 6 === 0 ? this.getLabelForValue(val) : '';
                    },
                },
            },
            y: {
                ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                        if (value >= 1000) {
                            return '$' + value.toLocaleString();
                        } else {
                            return '$' + value;
                        }
                    },
                    font: {
                        size: 14,
                        weight: 'bold',
                        family: "'Poppins', sans-serif",
                    },
                },
            },
        },
    };

    return (
        <div className="sparkline-container">
            <Line data={data} options={options} />
        </div>
    );
};

export default Sparkline;
