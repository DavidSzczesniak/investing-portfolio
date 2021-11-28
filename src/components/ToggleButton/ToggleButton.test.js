import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { ToggleButton } from './ToggleButton';

const mockOptions = [
    { value: '1', label: 'Button 1' },
    { value: '2', label: 'Button 2' },
];
const mockCallback = jest.fn();
const TestComponent = ({ defaultOption, onClick }) =>
    render(<ToggleButton options={mockOptions} defaultOption={defaultOption} onClick={onClick} />);

it('renders with basic props', async () => {
    const { getByTestId, getAllByRole } = TestComponent({});
    getByTestId('toggle-btn');

    // displays expected number of buttons and the selected one
    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Button 1');
    expect(buttons[1]).toHaveTextContent('Button 2');
    expect(buttons[0]).toHaveClass('selected');
});

it('renders with a specified default option', async () => {
    const { getByTestId, getAllByRole } = TestComponent({ defaultOption: '2' });
    getByTestId('toggle-btn');

    const buttons = getAllByRole('button');
    expect(buttons[1]).toHaveClass('selected');
});

it('updates the selected button', async () => {
    const { getAllByRole } = TestComponent({});

    // button that was clicked is now the selected one
    const buttons = getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(buttons[1]).toHaveClass('selected');
    // previous button is no longer selected
    expect(buttons[0]).not.toHaveClass('selected');
});

it('does nothing if the selected button is clicked again', async () => {
    const { getAllByRole } = TestComponent({});

    const buttons = getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveClass('selected');
});

it('executes the given callback from onClick prop', async () => {
    const { getAllByRole } = TestComponent({ onClick: mockCallback });

    const buttons = getAllByRole('button');
    // ensure both buttons trigger it
    fireEvent.click(buttons[0]);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    fireEvent.click(buttons[1]);
    expect(mockCallback).toHaveBeenCalledTimes(2);
});
