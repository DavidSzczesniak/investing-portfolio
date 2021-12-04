import { faStar as faOutlineStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { Button } from '../Button/Button';
import './FavouritesButton.scss';

export const FavouritesButton = ({ asset, refreshPage, refreshed }) => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const assetInWatchlist = watchlist.find((a) => a === asset.id);
    const [owned, setOwned] = useState(assetInWatchlist);

    function handleSaveAsset() {
        let newList = watchlist;
        if (watchlist.length > 0) {
            !owned && newList.push(asset.id);
        } else {
            newList = [asset.id];
        }
        localStorage.setItem('watchlist', JSON.stringify(newList));

        setOwned(true);
        refreshPage && refreshPage(!refreshed);
    }

    function handleRemoveAsset() {
        let newList = watchlist.filter((a) => {
            return a !== asset.id;
        });
        localStorage.setItem('watchlist', JSON.stringify(newList));

        setOwned(false);
        refreshPage && refreshPage(!refreshed);
    }

    return (
        <>
            {owned ? (
                <Button
                    className="favourites-btn"
                    testId="favourites-btn"
                    onClick={handleRemoveAsset}
                    ariaLabel="Remove from favourites"
                    icon={faStar}
                />
            ) : (
                <Button
                    className="favourites-btn"
                    testId="favourites-btn"
                    onClick={handleSaveAsset}
                    ariaLabel="Save to favourites"
                    icon={faOutlineStar}
                />
            )}
        </>
    );
};
