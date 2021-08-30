import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import NavBar from './NavBar';

const mockCallback = jest.fn();

const renderComponent = () => render(<NavBar refreshed={false} refreshApp={mockCallback} />);

it('renders with basic props', async () => {
    const { getByTestId, getByText, getByTitle } = renderComponent({});

    getByTestId('navbar');
});
