import React from 'react';
import { PieChart as Pie } from 'react-minimal-pie-chart';
import './PieChart.scss';

export const PieChart = ({ data }) => {
    return (
        <div className="pie-chart-container" data-testid="pie-chart">
            <Pie data={data} lineWidth={60} />
            <div className="pie-legend">
                {data.map((asset, index) => {
                    return (
                        <div key={index} data-testid="legend-item">
                            <div className="legend-dot" style={{ background: asset.color }}></div>
                            <span>{asset.title}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
