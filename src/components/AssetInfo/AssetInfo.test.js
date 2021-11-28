import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import { normalizeNumber } from '../../Utils/helpers';
import { AssetHoldings, AssetName, AssetPrice } from './AssetInfo';
import { compactNumber } from '../../Utils/helpers';

const assetMock = {
    current_price: 45439,
    id: 'bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    name: 'Bitcoin',
    price_change_percentage_24h: 3.26545,
    symbol: 'btc',
    amount: '1.23241',
};

const renderName = () => render(<AssetName asset={assetMock} />);
const renderPrice = ({ currency = '$' }) =>
    render(<AssetPrice asset={assetMock} currency={currency} />);
const renderHoldings = ({ currency = '$' }) =>
    render(<AssetHoldings asset={assetMock} currency={currency} />);

describe('Testing AssetName', () => {
    it('renders with basic props', async () => {
        const { getByTestId, getByText, getByAltText } = renderName();

        getByTestId('asset-name');
        getByText(assetMock.name);
        getByText(assetMock.symbol.toUpperCase());
        getByAltText(`${assetMock.name} logo`);
        const displayedImage = document.querySelector('img');
        expect(displayedImage.src).toEqual(assetMock.image);
    });
});

describe('Testing AssetPrice', () => {
    it('renders with basic props', async () => {
        const { getByTestId, getByText, getByTitle } = renderPrice({});

        getByTestId('asset-price');
        const normalizedPrice = normalizeNumber(assetMock.current_price, 4);
        getByText(`$${normalizedPrice}`);
        getByText(assetMock.price_change_percentage_24h.toFixed(2) + '%');
        getByTitle('caret-up');
    });
    it('renders with a different currency symbol', async () => {
        const { getByTestId, getByText } = renderPrice({ currency: '£' });

        getByTestId('asset-price');
        const normalizedPrice = normalizeNumber(assetMock.current_price, 4);
        getByText(`£${normalizedPrice}`);
    });
    it("doesn't format prices below 0", async () => {
        assetMock.current_price = 0.123;
        const { getByText } = renderPrice({});

        getByText('$0.123');
    });
});

describe('Testing AssetHoldings', () => {
    it('renders with basic props', async () => {
        const { getByTestId, getByText } = renderHoldings({});

        getByTestId('asset-holdings');
        const normalizedPrice = normalizeNumber(assetMock.amount * assetMock.current_price, 2);
        getByText(`$${normalizedPrice}`);
        const amount = `${compactNumber(assetMock.amount)} ${assetMock.symbol.toUpperCase()}`;
        getByText(amount);
    });
    it('renders with a different currency symbol', async () => {
        const { getByTestId, getByText } = renderHoldings({ currency: '£' });

        getByTestId('asset-holdings');
        const normalizedPrice = normalizeNumber(assetMock.amount * assetMock.current_price, 2);
        getByText(`£${normalizedPrice}`);
    });
});
