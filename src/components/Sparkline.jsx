import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { geckoAPI } from '../constants.js';
import '../css/Sparkline.scss';
import { isPositive } from '../Utils/helpers.js';

export const Sparkline = ({ asset }) => {
    const [assetPrices, setPrices] = useState(null);
    const [assetTimestamps, setTimestamps] = useState(null);
    const timeRanges = [
        { value: '1', label: '24h' },
        { value: '7', label: '7d' },
        { value: '30', label: '30d' },
        { value: '90', label: '90d' },
        { value: '365', label: '1y' },
        { value: 'max', label: 'All' },
    ];
    const [timeRange, setTimeRange] = useState(
        JSON.parse(localStorage.getItem('sparklineDataRange')).value || '1'
    );
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

    useEffect(() => {
        async function getMarketChart() {
            await axios
                .get(
                    `${geckoAPI}coins/${asset.id}/market_chart?vs_currency=${currency.value}&days=${timeRange}`
                )
                .then((res) => {
                    let timestamps = [];
                    let prices = [];
                    res.data.prices.forEach((price) => {
                        timestamps.push(
                            new Date(price[0]).toLocaleDateString('en-GB', {
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
    }, [asset.id, currency.value, timeRange]);

    function handleRangeSelection(selectedOption) {
        localStorage.setItem('sparklineDataRange', JSON.stringify(selectedOption));
        setTimeRange(selectedOption.value);
    }

    const data = {
        labels: assetTimestamps,
        datasets: [
            {
                data: assetPrices,
                borderWidth: 3,
                borderColor: isPositive(asset.price_change_percentage_24h) ? '#16c784' : '#ea3943',
            },
        ],
    };

    const options = {
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
                callbacks: {
                    label: function (context) {
                        // override default formatting of tooltips
                        let value = context.raw;
                        if (value >= 1000) {
                            value = value.toLocaleString();
                        } else {
                            value = value.toFixed(8);
                        }
                        return currency.symbol + value;
                    },
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
                        family: "'Poppins', sans-serif",
                    },
                    callback: function (index) {
                        const dateValue = this.getLabelForValue(index).split(',');
                        let interval = 4;
                        let label = dateValue[0];

                        function getDate(part = '0') {
                            if (part) {
                                return label.split('/')[part];
                            }

                            return label;
                        }

                        if (timeRange === '1') {
                            interval = 8;
                            label = dateValue[1];
                        } else if (timeRange === '7') {
                            interval = 6;
                            label = getDate();
                        } else if (timeRange === '30' || timeRange === '90') {
                            label = `${getDate()}/${getDate('1')}`;
                        } else if (timeRange === '365' || timeRange === 'max') {
                            label = `${getDate('1')}/${getDate('2')}`;
                        }

                        return index % interval === 0 ? label : '';
                    },
                },
            },
            y: {
                ticks: {
                    beginAtZero: true,
                    mirror: true,
                    callback: function (value) {
                        if (value >= 1) {
                            value = value.toLocaleString();
                        } else {
                            // rounds numbers below 0, up to 10 decimal places
                            value = Math.round(value * 10000000000) / 10000000000;
                        }
                        return currency.symbol + value;
                    },
                    font: {
                        size: 14,
                        family: "'Poppins', sans-serif",
                    },
                },
            },
        },
    };

    return (
        <div className="sparkline-container">
            <div className="time-ranges">
                {timeRanges.map((option, index) => {
                    return (
                        <button
                            key={index}
                            className={`${timeRange === option.value ? 'selected' : ''}`}
                            onClick={() => handleRangeSelection(option)}>
                            {option.label}
                        </button>
                    );
                })}
            </div>
            <Line data={data} options={options} />
        </div>
    );
};
