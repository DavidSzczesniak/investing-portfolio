import axios from 'axios';
import { createChart } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { geckoAPI } from '../constants.js';
import '../css/Sparkline.scss';
import { getCSSVar } from '../Utils/helpers.js';

export const Sparkline = ({ asset }) => {
    const chartDiv = useRef();
    const timeRanges = [
        { value: '1', label: '24h' },
        { value: '7', label: '7d' },
        { value: '30', label: '30d' },
        { value: '90', label: '90d' },
        { value: '365', label: '1y' },
        { value: 'max', label: 'All' },
    ];
    const [timeRange, setTimeRange] = useState(
        JSON.parse(localStorage.getItem('sparklineDataRange')) || {
            value: '1',
            label: '24 Hours',
        }
    );
    const currency = JSON.parse(localStorage.getItem('currency')).value || 'usd';

    useEffect(() => {
        getMarketChart();
        async function getMarketChart() {
            await axios
                .get(
                    `${geckoAPI}coins/${asset.id}/market_chart?vs_currency=${currency}&days=${timeRange.value}`
                )
                .then((res) => {
                    let formatted = [];
                    res.data.prices.forEach((price) => {
                        // convert to UTC timestamp
                        const timestamp = Math.floor(new Date(price[0]).getTime() / 1000);

                        formatted.push({ time: timestamp, value: price[1] });
                    });

                    if (chartDiv.current) {
                        // remove previous chart if it exists
                        const oldChart = document.querySelector('.tv-lightweight-charts');

                        if (oldChart) {
                            document.querySelector('.price-chart').removeChild(oldChart);
                        }

                        const chart = createChart(chartDiv.current, {
                            height: 300,
                            timeScale: {
                                timeVisible: true,
                            },
                            layout: {
                                background: {
                                    type: 'solid',
                                    color: getCSSVar('background'),
                                },
                                textColor: getCSSVar('foreground'),
                                fontSize: 14,
                                fontFamily: 'Poppins',
                            },
                            grid: {
                                vertLines: {
                                    visible: false,
                                },
                            },
                            priceScale: {
                                position: 'left',
                                borderVisible: true,
                                autoScale: true,
                            },
                        });
                        const lineSeries = chart.addLineSeries({
                            color: getCSSVar('clr-accent'),
                        });
                        lineSeries.setData(formatted);
                        chart.timeScale().fitContent();
                    }
                });
        }
    }, [asset.id, currency, timeRange]);

    function handleRangeSelection(selectedOption) {
        localStorage.setItem('sparklineDataRange', JSON.stringify(selectedOption));
        setTimeRange(selectedOption);
    }

    return (
        <div className="sparkline-container">
            <div className="time-ranges">
                {timeRanges.map((option, index) => {
                    return (
                        <button
                            key={index}
                            className={`${timeRange.value === option.value ? 'selected' : ''}`}
                            onClick={() => handleRangeSelection(option)}>
                            {option.label}
                        </button>
                    );
                })}
            </div>
            <div className="price-chart" ref={chartDiv}></div>
        </div>
    );
};
