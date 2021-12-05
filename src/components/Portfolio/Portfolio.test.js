import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Portfolio } from './Portfolio';

const renderComponent = () => render(<Portfolio />);

it('renders with basic props', async () => {
    const { getByTestId, getByText } = renderComponent();

    getByTestId('portfolio');
    getByText('No assets found');
});

it('toggles Deposit screen', async () => {
    const { getByTestId, getByText, queryByText } = renderComponent();

    fireEvent.click(getByText('Deposit'));
    getByTestId('deposit');
    fireEvent.click(getByTestId('close'));
    expect(queryByText('deposit')).toBeFalsy();
});
