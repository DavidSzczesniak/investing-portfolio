import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { CurrencyList } from './CurrencyList';

const refreshFn = jest.fn();
const closeFn = jest.fn();

const renderComponent = () =>
    render(<CurrencyList refreshed={false} refreshApp={refreshFn} close={closeFn} />);

it('renders with basic props', async () => {
    const { getByTestId } = renderComponent();

    getByTestId('currency-list');
});

it('executes close prop callback', async () => {
    const { getByRole } = renderComponent();

    fireEvent.click(getByRole('button'));
    expect(closeFn).toHaveBeenCalledTimes(1);
});

it('executes refreshApp prop callback when selecting currency', async () => {
    const { getAllByTestId } = renderComponent();

    fireEvent.click(getAllByTestId('currency-item')[1]);
    expect(refreshFn).toHaveBeenCalledTimes(1);
});
