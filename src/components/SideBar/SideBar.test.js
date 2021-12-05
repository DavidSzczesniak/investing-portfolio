import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import { SideBar } from './SideBar';
import { act } from 'react-dom/test-utils';

const refreshFn = jest.fn();
const closeFn = jest.fn();

const renderComponent = () => {
    const history = createMemoryHistory();
    const component = render(
        <Router history={history}>
            <SideBar refreshed={false} refreshApp={refreshFn} close={closeFn} />
        </Router>
    );

    return { history, ...component };
};
const body = document.getElementsByTagName('body')[0];
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

it('renders with basic props', async () => {
    const { getByTestId } = renderComponent();

    getByTestId('sidebar');
});

it('executes close prop callback', async () => {
    const { getByTestId } = renderComponent();

    fireEvent.click(document.getElementsByClassName('site-logo')[0]);
    expect(closeFn).toHaveBeenCalledTimes(1);
    fireEvent.click(getByTestId('custom-btn close-sidebar'));
    expect(closeFn).toHaveBeenCalledTimes(2);
});

it('opens currency switch modal', async () => {
    const { getByTestId } = renderComponent();

    const mockPortalTarget = document.createElement('div');
    mockPortalTarget.setAttribute('id', 'modal');
    body.appendChild(mockPortalTarget);
    fireEvent.click(document.getElementsByClassName('change-currency')[0]);
    getByTestId('currency-list');
});

it('toggles dark mode', async () => {
    const { getByTestId } = renderComponent();

    expect(body).not.toHaveClass('dark-theme');
    fireEvent.click(getByTestId('custom-btn dark-mode'));
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
