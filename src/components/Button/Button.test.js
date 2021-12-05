import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from './Button';

const mockCallback = jest.fn();
const renderComponent = ({ isSecondary = false }) => {
    const component = render(
        <Button label="Click Me!" icon={faPlus} isSecondary={isSecondary} onClick={mockCallback} />
    );
    const button = component.getByTestId('custom-btn');

    return { button, ...component };
};

it('renders with props', async () => {
    const { button } = renderComponent({});

    expect(button).toHaveTextContent('Click Me!');
    expect(button).toContainHTML('svg');
    expect(button).not.toHaveClass('secondary-btn');
});

it('renders with props and secondary styling', async () => {
    const { button } = renderComponent({ isSecondary: true });

    expect(button).toHaveClass('secondary-btn');
});

it('renders with just an icon', async () => {
    const { getByTestId } = render(<Button icon={faPlus} />);

    const button = getByTestId('custom-btn');
    expect(button).toHaveTextContent('');
    expect(button).toContainHTML('svg');
});

it('executes callback function on click', async () => {
    const { button } = renderComponent({});

    fireEvent.click(button);

    expect(mockCallback).toHaveBeenCalledTimes(1);
});
