import { faStar as faOutlineStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useMemo } from 'react';
import './FavouritesButton.scss';

export const FavouritesButton = ({ asset, refreshPage, refreshState }) => {
    const userAssetList = useMemo(() => JSON.parse(localStorage.getItem('assetList')) || [], []);
    const [owned, setOwned] = useState(false);

    useEffect(() => {
        if (userAssetList.length > 0) {
            const assetMatches = (currentAsset) => currentAsset.symbol === asset.symbol;
            if (userAssetList.some(assetMatches)) {
                setOwned(true);
            } else {
                setOwned(false);
            }
        }
    }, [asset.id, asset.symbol, userAssetList]);

    function handleSaveAsset() {
        let currentList = userAssetList;
        asset.updatedOn = new Date();
        if (currentList.length > 0) {
            if (!currentList.find((e) => e.id === asset.id)) {
                // prevent duplicates saved
                currentList.push(asset);
            }
            currentList = JSON.stringify(currentList);
        } else {
            currentList = JSON.stringify([asset]);
        }
        localStorage.setItem('assetList', currentList);

        setOwned(true);
        refreshPage && refreshPage(!refreshState);
    }

    function handleRemoveAsset() {
        let newList = userAssetList.filter((currentAsset) => {
            return currentAsset.symbol !== asset.symbol;
        });
        newList = JSON.stringify(newList);
        localStorage.setItem('assetList', newList);

        setOwned(false);
        refreshPage && refreshPage(!refreshState);
    }

    return (
        <>
            {owned ? (
                <button
                    data-testid="remove-asset"
                    className="favourites-btn"
                    onClick={handleRemoveAsset}
                    aria-label="Remove from Favourites">
                    <FontAwesomeIcon icon={faStar} />
                </button>
            ) : (
                <button
                    data-testid="save-asset"
                    className="favourites-btn"
                    onClick={handleSaveAsset}
                    aria-label="Add to Favourites">
                    <FontAwesomeIcon icon={faOutlineStar} />
                </button>
            )}
        </>
    );
};
