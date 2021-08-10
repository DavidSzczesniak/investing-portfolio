import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AssetInfo from './AssetInfo';

const assetObjMock = {
    ath: 64805,
    ath_change_percentage: -29.48231,
    ath_date: '2021-04-14T11:54:46.763Z',
    atl: 67.81,
    atl_change_percentage: 67293.40016,
    atl_date: '2013-07-06T00:00:00.000Z',
    circulating_supply: 18781275,
    current_price: 45439,
    fully_diluted_valuation: 956223416164,
    high_24h: 46433,
    id: 'bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    last_updated: '2021-08-09T21:12:27.564Z',
    low_24h: 42981,
    market_cap: 855194997162,
    market_cap_change_24h: 29402970731,
    market_cap_change_percentage_24h: 3.56058,
    market_cap_rank: 1,
    max_supply: 21000000,
    name: 'Bitcoin',
    price_change_24h: 1436.86,
    price_change_percentage_24h: 3.26545,
    roi: null,
    symbol: 'btc',
    total_supply: 21000000,
    total_volume: 41156019415,
    updatedOn: '2021-08-09T21:13:12.469Z',
};
const mockCallback = jest.fn();

const renderComponent = ({ onClick }) =>
    render(<AssetInfo asset={assetObjMock} userAssetList={[assetObjMock]} onClick={onClick} />);

it('renders with basic props - positive price change', async () => {
    const { getByTestId } = renderComponent({});

    expect(getByTestId('asset-info')).toBeInTheDocument();
});

it('renders with basic props - negative price change', async () => {
    assetObjMock.price_change_percentage_24h = -2;
    const { getByTestId } = renderComponent({});

    expect(getByTestId('asset-info')).toBeInTheDocument();
});

it('executes callback function on click of asset title', async () => {
    const { getByTestId } = renderComponent({ onClick: mockCallback });

    fireEvent.click(getByTestId('asset-title'));

    expect(mockCallback).toHaveBeenCalledTimes(1);
});

it('removes and saves asset from watchlist', async () => {
    const { getByTestId } = renderComponent({});

    // asset is removed, button changes to Save function
    fireEvent.click(screen.getByTestId('remove-asset'));
    expect(getByTestId('save-asset')).toBeInTheDocument();
    expect(localStorage.getItem('assetList')).toBe('[]');

    // asset is saved, button changes to Remove function
    fireEvent.click(screen.getByTestId('save-asset'));
    expect(getByTestId('remove-asset')).toBeInTheDocument();
    expect(localStorage.getItem('assetList')).toBe(JSON.stringify([assetObjMock]));
});
