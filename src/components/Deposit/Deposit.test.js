import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Deposit } from './Deposit';

const resultsMock = [
    {
        id: 'bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579',
        name: 'Bitcoin',
        symbol: 'btc',
        amount: '1.23241',
        market_cap_rank: '1',
    },
    {
        id: 'ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
        name: 'Eethereum',
        symbol: 'eth',
        amount: '0.513',
        market_cap_rank: '2',
    },
    {
        id: 'cardano',
        image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png?1547034860',
        name: 'Cardano',
        symbol: 'ada',
        amount: '789.123',
        market_cap_rank: '6',
    },
];
const mockCallback = jest.fn();
const renderComponent = () => {
    const component = render(<Deposit searchOptions={resultsMock} close={mockCallback} />);
    const input = component.getByRole('textbox');
    const listItems = component.getAllByTestId('asset-list-item');
    // set up container for modal
    const mockPortalTarget = document.createElement('div');
    mockPortalTarget.setAttribute('id', 'modal');
    document.getElementsByTagName('body')[0].appendChild(mockPortalTarget);

    return { input, listItems, ...component };
};
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

it('renders with basic props', async () => {
    const { getByTestId, listItems } = renderComponent();

    getByTestId('deposit');
    expect(listItems).toHaveLength(3);
});

it('executes close prop callback', async () => {
    const { getByTestId } = renderComponent();

    fireEvent.click(getByTestId('close'));
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

it('takes in user input', async () => {
    const { input } = renderComponent();

    expect(input.value).toBe('');
    fireEvent.change(input, { target: { value: 'Bitcoin' } });
    expect(input.value).toBe('Bitcoin');
});

it('clears user input when button is clicked', async () => {
    const { input, getByTestId } = renderComponent();

    fireEvent.change(input, { target: { value: 'Bitcoin' } });
    expect(input.value).toBe('Bitcoin');
    fireEvent.click(getByTestId('clear-search'));
    expect(input.value).toBe('');
});

it('filters list items by user input', async () => {
    const { input, listItems } = renderComponent();

    expect(listItems[0]).toHaveTextContent('Bitcoin');
    fireEvent.change(input, { target: { value: 'Cardano' } });
    expect(listItems[0]).toHaveTextContent('Cardano');
    // also returns to full list if search input is empty
    fireEvent.change(input, { target: { value: '' } });
    expect(listItems[0]).toHaveTextContent('Bitcoin');
});

it("displays a message if user input didn't match", async () => {
    const { input, getByText } = renderComponent();

    fireEvent.change(input, { target: { value: 'adwadwjkjjk' } });
    getByText('No results found');
});

it('opens modal to edit an asset', async () => {
    const { getByTestId, listItems } = renderComponent();

    fireEvent.click(listItems[0]);
    getByTestId('edit-asset');
});

it('saves new asset amount', async () => {
    const { getByTestId, debug, listItems, getByText } = renderComponent();

    fireEvent.click(listItems[0]);
    const editInput = getByTestId('asset-input');
    expect(editInput).toHaveValue(0);
    fireEvent.change(editInput, { target: { value: '1' } });
    expect(editInput).toHaveValue(1);
    fireEvent.submit(getByTestId('form'));
    // value is saved in the list
    getByText(`1 ${resultsMock[0].symbol.toUpperCase()}`);
});
