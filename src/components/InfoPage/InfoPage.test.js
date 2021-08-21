import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import InfoPage from './InfoPage';

const renderComponent = ({ title = 'Test title' }) =>
    render(<InfoPage title={title} message="Test message goes here" icon={faQuestion} />);

it('renders with basic props', async () => {
    const { getByText } = renderComponent({});

    getByText('Test title');
    getByText('Test message goes here');
});

it('renders Search button for empty watchlist', async () => {
    const { getByTestId } = renderComponent({ title: 'Woops! Nothing here!' });

    expect(getByTestId('custom-btn')).toHaveTextContent('Search');
});
