import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { geckoAPI } from '../../constants.js';
import './AssetChart.scss';
import { getCSSVar, isPositive } from '../../Utils/helpers.js';

export const AssetChart = ({ asset }) => {
    const [chartData, setChartData] = useState({ x: null, y: null });
    const timeRanges = [
        { value: '1', label: '24h' },
        { value: '7', label: '7d' },
        { value: '30', label: '30d' },
        { value: '90', label: '90d' },
        { value: '365', label: '1y' },
        { value: 'max', label: 'All' },
    ];
    const [timeRange, setTimeRange] = useState(
        JSON.parse(localStorage.getItem('chartTimeRange'))?.value || '1'
    );
    const dataTypes = [
        { value: 'prices', label: 'Price' },
        { value: 'market_caps', label: 'Market Cap' },
    ];
    const [dataType, setSetDataType] = useState(
        JSON.parse(localStorage.getItem('chartDataType'))?.value || 'prices'
    );
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'USD',
        label: 'United States Dollar',
        symbol: '$',
    };

    useEffect(() => {
        // set gradient and color options for the chart
        const chartCtx = document.getElementsByTagName('canvas')[0].getContext('2d');
        const gradient = chartCtx.createLinearGradient(0, 0, 0, 600);

        if (isPositive(asset.price_change_percentage_24h)) {
            gradient.addColorStop(0, 'rgb(22, 199, 132, 0.5)');
            gradient.addColorStop(0.5, 'rgb(22, 199, 132, 0.05)');
        } else {
            gradient.addColorStop(0, 'rgba(234, 57, 67, 0.5)');
            gradient.addColorStop(0.5, 'rgba(234, 57, 67, 0.05)');
        }

        getMarketChart();
        async function getMarketChart() {
            await axios
                .get(
                    `${geckoAPI}coins/${asset.id}/market_chart?vs_currency=${currency.value}&days=${timeRange}`
                )
                .then((res) => {
                    let xAxis = [];
                    let yAxis = [];
                    res.data[dataType].forEach((data) => {
                        xAxis.push(
                            new Date(data[0]).toLocaleDateString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                        );
                        yAxis.push(data[1]);
                    });

                    setChartData({
                        labels: xAxis,
                        datasets: [
                            {
                                data: yAxis,
                                borderWidth: 2.5,
                                borderColor: isPositive(asset.price_change_percentage_24h)
                                    ? getCSSVar('up')
                                    : getCSSVar('down'),
                                backgroundColor: gradient,
                                fill: true,
                                tension: 0.2,
                            },
                        ],
                    });
                });
        }
    }, [asset.id, asset.price_change_percentage_24h, currency.value, dataType, timeRange]);

    function handleRangeSelection(selected) {
        localStorage.setItem('chartTimeRange', JSON.stringify(selected));
        setTimeRange(selected.value);
    }

    function handleDataTypeSelection(selected) {
        localStorage.setItem('chartDataType', JSON.stringify(selected));
        setSetDataType(selected.value);
    }

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
                        let label = dateValue[0];

                        function getDate(part = '0') {
                            if (part) {
                                return label.split('/')[part];
                            }

                            return label;
                        }

                        if (timeRange === '1') {
                            label = dateValue[1];
                        } else if (timeRange === '7') {
                            label = getDate();
                        } else if (timeRange === '30' || timeRange === '90') {
                            label = `${getDate()}/${getDate('1')}`;
                        } else if (timeRange === '365' || timeRange === 'max') {
                            label = `${getDate('1')}/${getDate('2')}`;
                        }

                        return index % 2 === 0 ? label : '';
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                        if (value >= 1) {
                            return new Intl.NumberFormat('en-GB', {
                                notation: 'compact',
                                minimumSignificantDigits: 4,
                            }).format(value);
                        } else {
                            // rounds numbers below 0, up to 10 decimal places
                            return Math.round(value * 10000000000) / 10000000000;
                        }
                    },
                    font: {
                        size: 14,
                        family: "'Poppins', sans-serif",
                    },
                },
            },
        },
    };

    const ToggleButton = ({ current, options, onClick }) => {
        return (
            <div className="toggle-btn">
                {options.map((option, index) => {
                    return (
                        <button
                            key={index}
                            className={`${current === option.value ? 'selected' : ''}`}
                            onClick={() => onClick(option)}>
                            {option.label}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="chart-container">
            <div className="chart-header">
                <ToggleButton
                    current={dataType}
                    options={dataTypes}
                    onClick={handleDataTypeSelection}
                />
                <ToggleButton
                    current={timeRange}
                    options={timeRanges}
                    onClick={handleRangeSelection}
                />
            </div>
            <Line data={chartData} options={options} />
        </div>
    );
};
