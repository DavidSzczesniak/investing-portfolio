import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import { PieChart } from './PieChart';

const mockData = [
    { title: 'Bitcoin', value: 50, color: 'red' },
    { title: 'Ethereum', value: 50, color: 'blue' },
];
const renderComponent = () => render(<PieChart data={mockData} />);

it('renders with basic props', async () => {
    const { getByTestId } = renderComponent();

    getByTestId('pie-chart');
});

it('renders given data in pie', async () => {
    renderComponent();

    const pieSections = document.getElementsByTagName('path');
    // check text and color rendered
    expect(pieSections[0]).toHaveTextContent(mockData[0].title);
    expect(pieSections[0].getAttribute('stroke')).toBe(mockData[0].color);
    expect(pieSections[1]).toHaveTextContent(mockData[1].title);
    expect(pieSections[1].getAttribute('stroke')).toBe(mockData[1].color);
});

it('renders given data in legend', async () => {
    const { getAllByTestId } = renderComponent();

    expect(getAllByTestId('legend-item')[0]).toHaveTextContent(mockData[0].title);
    expect(getAllByTestId('legend-item')[1]).toHaveTextContent(mockData[1].title);
});

it('renders legend items with correct color key', async () => {
    renderComponent();

    const legendDots = document.getElementsByClassName('legend-dot');
    expect(legendDots[0]).toHaveStyle({ background: mockData[0].color });
    expect(legendDots[1]).toHaveStyle({ background: mockData[1].color });
});
