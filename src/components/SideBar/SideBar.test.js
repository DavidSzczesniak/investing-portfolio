import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router';
import { SideBar } from './SideBar';

const refreshFn = jest.fn();
const closeFn = jest.fn();

const renderComponent = () => {
    const history = createMemoryHistory();
    return render(
        <Router history={history}>
            <SideBar refreshed={false} refreshApp={refreshFn} close={closeFn} />
        </Router>
    );
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

    fireEvent.click(getByTestId('site-logo'));
    expect(closeFn).toHaveBeenCalledTimes(1);
    fireEvent.click(getByTestId('custom-btn close-sidebar'));
    expect(closeFn).toHaveBeenCalledTimes(2);
});

it('opens currency switch modal', async () => {
    const { getByTestId } = renderComponent();

    const mockPortalTarget = document.createElement('div');
    mockPortalTarget.setAttribute('id', 'modal');
    body.appendChild(mockPortalTarget);
    fireEvent.click(getByTestId('change-currency'));
    getByTestId('currency-list');
});

it('toggles dark mode', async () => {
    const { getByTestId } = renderComponent();

    expect(body).not.toHaveClass('dark-theme');
    fireEvent.click(getByTestId('custom-btn dark-mode'));
    expect(body).toHaveClass('dark-theme');
});
