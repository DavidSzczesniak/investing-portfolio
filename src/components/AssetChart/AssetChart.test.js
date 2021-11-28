import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import 'jest-canvas-mock';
import React from 'react';
import { AssetChart } from './AssetChart';

const assetMock = {
    id: 'bitcoin',
    price_change_percentage_24h: 3.26545,
};

const renderComponent = () => render(<AssetChart asset={assetMock} />);

jest.mock('react-chartjs-2', () => ({
    Line: () => null,
}));

it('renders with basic props', async () => {
    const { getByTestId, getAllByTestId } = renderComponent();

    getByTestId('chart-container');
    const toggleButtons = getAllByTestId('toggle-btn');
    expect(toggleButtons).toHaveLength(2);
});
