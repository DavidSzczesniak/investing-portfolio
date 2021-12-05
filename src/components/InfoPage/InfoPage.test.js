import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { InfoPage } from './InfoPage';

const body = document.getElementsByTagName('body')[0];
const renderComponent = ({ title = 'Test title' }) => {
    const mockPortalTarget = document.createElement('div');
    mockPortalTarget.setAttribute('id', 'modal');
    body.appendChild(mockPortalTarget);

    return render(<InfoPage title={title} message="Test message goes here" icon={faQuestion} />);
};
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

it('renders with basic props', async () => {
    const { getByText } = renderComponent({});

    getByText('Test title');
    getByText('Test message goes here');
    expect(document.getElementsByTagName('svg')[0].getAttribute('data-icon')).toBe('question');
});

it('renders Search button for empty watchlist', async () => {
    const { getByTestId } = renderComponent({ title: 'Woops! Nothing here!' });

    expect(getByTestId('custom-btn')).toHaveTextContent('Search');
});

it('opens asset search modal', async () => {
    const { getByText, getByTestId } = renderComponent({ title: 'Woops! Nothing here!' });

    fireEvent.click(getByText('Search'));
    getByTestId('search-field');
});
