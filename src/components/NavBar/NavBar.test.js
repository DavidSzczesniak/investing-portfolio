import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import { NavBar } from './NavBar';
import { act } from 'react-dom/test-utils';

const mockCallback = jest.fn();
const body = document.getElementsByTagName('body')[0];
const renderComponent = () => {
    const mockPortalTarget = document.createElement('div');
    mockPortalTarget.setAttribute('id', 'modal');
    body.appendChild(mockPortalTarget);

    const history = createMemoryHistory();
    const component = render(
        <Router history={history}>
            <NavBar refreshed={false} refreshApp={mockCallback} toggleSideBar={mockCallback} />
        </Router>
    );

    return { history, ...component };
};
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

it('renders with basic props', async () => {
    const { getByTestId } = renderComponent();

    getByTestId('navbar');
});

it('executes toggleSideBar callback', async () => {
    renderComponent();

    fireEvent.click(document.getElementsByClassName('hamburger')[0]);
    expect(mockCallback).toHaveBeenCalledTimes(1);
});

it('opens currency switch modal', async () => {
    const { getByTestId } = renderComponent();

    fireEvent.click(document.getElementsByClassName('change-currency')[0]);
    getByTestId('currency-list');
});

it('opens asset search modal', async () => {
    const { getByTestId } = renderComponent();

    fireEvent.click(getByTestId('open-search'));
    getByTestId('search-field');
});

it('toggles dark mode', async () => {
    renderComponent();

    expect(body).not.toHaveClass('dark-theme');
    fireEvent.click(document.getElementsByClassName('dark-mode-toggle')[0]);
    expect(body).toHaveClass('dark-theme');
});

it('navigates to homepage', async () => {
    const { history } = renderComponent();

    act(() => {
        history.push('/portfolio');
    });
    expect(history.location.pathname).toBe('/portfolio');
    fireEvent.click(document.getElementsByClassName('site-logo')[0]);
    expect(history.location.pathname).toBe('/');
});

it('navigates to watchlist and highlights link', async () => {
    const { history, getByText } = renderComponent();

    expect(history.location.pathname).toBe('/');
    fireEvent.click(getByText('Watchlist'));
    expect(history.location.pathname).toBe('/user-list');
    expect(getByText('Watchlist')).toHaveClass('active');
});

it('navigates to portfolio and highlights link', async () => {
    const { history, getByText } = renderComponent();

    expect(history.location.pathname).toBe('/');
    fireEvent.click(getByText('Portfolio'));
    expect(history.location.pathname).toBe('/portfolio');
    expect(getByText('Portfolio')).toHaveClass('active');
});
