import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { AssetSearch } from './AssetSearch';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

const resultsMock = [
    {
        current_price: 45439,
        id: 'bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
        name: 'Bitcoin',
        price_change_percentage_24h: 3.26545,
        symbol: 'btc',
        amount: '1.23241',
        market_cap_rank: '1',
    },
];

const mockCallback = jest.fn();
const renderComponent = () => {
    const history = createMemoryHistory();
    const component = render(
        <Router history={history}>
            <AssetSearch searchOptions={resultsMock} close={mockCallback} />
        </Router>
    );
    const input = component.getByRole('textbox');

    return { input, ...component };
};

it('renders with basic props', async () => {
    const { getByTestId, getByRole } = renderComponent();

    getByTestId('search-field');
    getByRole('button');
});

it('takes in user input', async () => {
    const { input } = renderComponent();

    expect(input.value).toBe('');
    fireEvent.change(input, { target: { value: 'Bitcoin' } });
    expect(input.value).toBe('Bitcoin');
});

it('clears user input when button clicked', async () => {
    const { input, getByRole } = renderComponent();

    fireEvent.change(input, { target: { value: 'Bitcoin' } });
    expect(input.value).toBe('Bitcoin');
    fireEvent.click(getByRole('button'));
    expect(input.value).toBe('');
});

it('displays search results if user input matches', async () => {
    const { input, getByTestId, getByText } = renderComponent();

    const mockAsset = resultsMock[0];
    fireEvent.change(input, { target: { value: 'Bitcoin' } });
    getByTestId('search-results');
    getByText(`# ${mockAsset.market_cap_rank}`);
    getByText(mockAsset.name);
    getByText(mockAsset.symbol.toUpperCase());
    const displayedImage = document.querySelector('img');
    expect(displayedImage.src).toEqual(mockAsset.image);
});

it("displays a message if user input didn't match", async () => {
    const { input, getByText } = renderComponent();

    fireEvent.change(input, { target: { value: 'adwadwjkjjk' } });
    getByText('No results found');
});

it('executes callback function when result is clicked', async () => {
    const { input, getByTestId } = renderComponent();

    fireEvent.change(input, { target: { value: 'Bitcoin' } });
    fireEvent.click(getByTestId('search-result'));
    expect(mockCallback).toHaveBeenCalledTimes(1);
});
