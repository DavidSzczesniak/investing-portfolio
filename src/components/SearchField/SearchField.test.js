import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { SearchField } from './SearchField';
import { render, fireEvent } from '@testing-library/react';

const mockCallback = jest.fn();

const renderComponent = ({ clearSearch, size }) => {
    const onChange = jest.fn();

    const component = render(
        <SearchField inputValue={''} onChange={onChange} clearSearch={clearSearch} size={size} />
    );
    const input = component.getByRole('textbox');

    return { input, onChange, ...component };
};

it('renders with basic props', async () => {
    const { getByTestId } = renderComponent({});

    getByTestId('search-field');
    expect(getByTestId('search-field')).toHaveClass('md');
});

it('renders in different size based on size prop', async () => {
    const { getByTestId } = renderComponent({ size: 'lg' });

    expect(getByTestId('search-field')).toHaveClass('search-field lg');
});

it('takes in user input and displays it', async () => {
    const { input, onChange, rerender } = renderComponent({});

    expect(input.value).toBe('');
    fireEvent.change(input, { target: { value: 'Bitcoin' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    rerender(<SearchField inputValue={'Bitcoin'} onChange={onChange} />);
    expect(input.value).toBe('Bitcoin');
});

it('executes callback function on button click', async () => {
    const { getByRole } = renderComponent({ clearSearch: mockCallback });

    fireEvent.click(getByRole('button'));
    expect(mockCallback).toHaveBeenCalledTimes(1);
});
