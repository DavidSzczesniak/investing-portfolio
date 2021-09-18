import React, { useState } from 'react';
import { Slice, VictoryLabel, VictoryPie } from 'victory';
import './PieChart.scss';

export const PieChart = ({ data }) => {
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };
    const [pieMessage, setPieMessage] = useState(data[0].x);

    function selectSlice(event) {
        // get index of element relative to its parent, using that to get the label because they're separate elements
        const index = [...event.target.parentNode.children].indexOf(event.target);
        setPieMessage(document.querySelector(`text#pie-labels-${index}`).textContent);

        if (document.querySelector('.pie-slice.selected')) {
            document.querySelector('.pie-slice.selected').setAttribute('class', 'pie-slice');
        }
        event.target.setAttribute('class', 'pie-slice selected');
    }

    return (
        <svg viewBox="-40 10 400 300">
            <VictoryPie
                standalone={false}
                width={320}
                height={320}
                data={data}
                style={{ labels: { fontSize: 12, fill: 'var(--foreground)' } }}
                padAngle={1}
                innerRadius={60}
                colorScale="qualitative"
                cornerRadius={5}
                dataComponent={
                    <Slice events={{ onClick: (e) => selectSlice(e) }} className="pie-slice" />
                }
            />
            <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 13 }}
                x={160}
                y={160}
                text={pieMessage}
            />
        </svg>
    );
};
