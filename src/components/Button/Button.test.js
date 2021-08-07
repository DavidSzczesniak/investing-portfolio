import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from './Button';

test('loads and displays with label and icon', async () => {
    render(<Button label="Click Me!" icon={faPlus} />);

    expect(screen.getByTestId('custom-btn')).toHaveTextContent('Click Me!');
    expect(screen.getByTestId('custom-btn')).toContainHTML('svg');
});

test('loads and displays with just an icon', async () => {
    render(<Button icon={faPlus} />);

    expect(screen.getByTestId('custom-btn')).toHaveTextContent('');
    expect(screen.getByTestId('custom-btn')).toContainHTML('svg');
});

test('loads and displays with secondary styling', async () => {
    render(<Button label="Click Me!" isSecondary />);

    expect(screen.getByTestId('custom-btn')).toHaveClass('secondary-btn');
});

test('executes callback function on click', async () => {
    const mockCallback = jest.fn();
    render(<Button label="Click Me!" onClick={mockCallback} />);

    const button = screen.getByTestId('custom-btn');
    fireEvent.click(button);

    expect(mockCallback).toHaveBeenCalledTimes(1);
});
