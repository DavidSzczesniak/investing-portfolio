import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AssetInfo from './AssetInfo';

const assetMock = {
    circulating_supply: 18781275,
    current_price: 45439,
    id: 'bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    market_cap: 855194997162,
    name: 'Bitcoin',
    price_change_percentage_24h: 3.26545,
    symbol: 'btc',
    total_volume: 41156019415,
    updatedOn: '2021-08-09T21:13:12.469Z',
};
const mockCallback = jest.fn();

const renderComponent = ({ onClick }) =>
    render(<AssetInfo asset={assetMock} userAssetList={[assetMock]} onClick={onClick} />);

it('renders with basic props', async () => {
    const { getByTestId, getByText, getByTitle } = renderComponent({});

    getByTestId('asset-info');
    getByText(assetMock.name);
    getByText(assetMock.symbol.toUpperCase());
    getByText('$' + assetMock.current_price.toLocaleString());
    getByText(assetMock.price_change_percentage_24h.toFixed(2) + '%');
    getByTitle('caret-up');
});

it('renders with basic props - negative price change', async () => {
    assetMock.price_change_percentage_24h = -2;
    const { getByTestId, getByTitle } = renderComponent({});

    getByTestId('asset-info');
    getByTitle('caret-down');
});

it('executes callback function on click of asset title', async () => {
    const { getByTestId } = renderComponent({ onClick: mockCallback });

    fireEvent.click(getByTestId('asset-name'));

    expect(mockCallback).toHaveBeenCalledTimes(1);
});

it('removes and saves asset from watchlist', async () => {
    const { getByTestId } = renderComponent({});

    // asset is removed, button changes to Save function
    fireEvent.click(screen.getByTestId('remove-asset'));
    getByTestId('save-asset');
    expect(localStorage.getItem('assetList')).toBe('[]');

    // asset is saved, button changes to Remove function
    fireEvent.click(screen.getByTestId('save-asset'));
    getByTestId('remove-asset');
    expect(localStorage.getItem('assetList')).toBe(JSON.stringify([assetMock]));
});
