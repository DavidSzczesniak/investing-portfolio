import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from './Button';

const renderComponent = ({ onClick, isSecondary = false }) =>
    render(<Button label="Click Me!" icon={faPlus} isSecondary={isSecondary} onClick={onClick} />);
const mockCallback = jest.fn();

it('renders with props', async () => {
    const { getByTestId } = renderComponent({});

    expect(getByTestId('custom-btn')).toHaveTextContent('Click Me!');
    expect(getByTestId('custom-btn')).toContainHTML('svg');
    expect(getByTestId('custom-btn')).not.toHaveClass('secondary-btn');
});

it('renders with props and secondary styling', async () => {
    const { getByTestId } = renderComponent({ isSecondary: true });

    expect(getByTestId('custom-btn')).toHaveClass('secondary-btn');
});

it('renders with just an icon', async () => {
    const { getByTestId } = render(<Button icon={faPlus} />);

    expect(getByTestId('custom-btn')).toHaveTextContent('');
    expect(getByTestId('custom-btn')).toContainHTML('svg');
});

it('executes callback function on click', async () => {
    const { getByTestId } = renderComponent({ onClick: mockCallback });

    const button = getByTestId('custom-btn');
    fireEvent.click(button);

    expect(mockCallback).toHaveBeenCalledTimes(1);
});
