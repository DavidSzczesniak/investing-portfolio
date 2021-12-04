import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { FavouritesButton } from './FavouritesButton';

const refreshFn = jest.fn();
const mockAsset = {
    id: 'bitcoin',
};
const renderComponent = () => {
    const component = render(
        <FavouritesButton asset={mockAsset} refreshPage={refreshFn} refreshed={false} />
    );
    const button = component.getByTestId('custom-btn favourites-btn');

    return { button, ...component };
};

it('renders with basic props', async () => {
    const { button } = renderComponent();

    // expect default state of button
    expect(button).toHaveAccessibleName('Save to favourites');
});

it('button icon toggles when clicked', async () => {
    const { button } = renderComponent();

    expect(button).toHaveAccessibleName('Save to favourites');
    fireEvent.click(button);
    expect(button).toHaveAccessibleName('Remove from favourites');
    fireEvent.click(button);
    expect(button).toHaveAccessibleName('Save to favourites');
});

it('triggers refreshPage callback - saving and removing', async () => {
    const { button } = renderComponent();

    fireEvent.click(button);
    expect(refreshFn).toHaveBeenCalledTimes(1);
    // button changes here to 'remove' state
    fireEvent.click(button);
    expect(refreshFn).toHaveBeenCalledTimes(2);
});
