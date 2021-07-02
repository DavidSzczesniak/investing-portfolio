import React, { useEffect, useState } from 'react';
import { isPositive } from '../Utils/helpers';
import Button from './Button';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faOutlineStar } from '@fortawesome/free-regular-svg-icons';
import '../css/AssetInfo.css';
import loadingGif from '../assets/loading-dots.gif';
import Sparkline from './Sparkline';

const AssetInfo = (props) => {
    const { asset, refreshPage, refreshState, userAssetList, styleXL, click } = props;
    const [owned, setOwned] = useState(false);
    const priceChangePositive = isPositive(asset.price_change_percentage_24h);

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
        <div
            className={`asset-container ${styleXL ? 'styleXL' : ''}`}
            onClick={() => click && !styleXL && click()}>
            <div className="asset-header">
                <div className="asset-title">
                    <img src={asset.image} alt={`${asset.name} logo`} />
                    <span>{asset.name}</span>
                    <span className="asset-symbol">{asset.symbol.toUpperCase()}</span>
                </div>
                <div className="current-price">
                    {asset.current_price ? (
                        <>
                            <span>
                                $
                                {asset.current_price >= 1000
                                    ? asset.current_price.toLocaleString()
                                    : asset.current_price}
                            </span>
                            <span
                                className={`
                            ${priceChangePositive ? 'positive' : 'negative'} price-change
                        `}>
                                {asset.price_change_percentage_24h.toFixed(2)}%
                            </span>
                        </>
                    ) : (
                        <img src={loadingGif} alt="loading animation" style={{ height: '40px' }} />
                    )}
                    {owned ? (
                        <Button click={handleRemoveAsset} icon={faStar} isSecondary />
                    ) : (
                        <Button click={handleSaveAsset} icon={faOutlineStar} isSecondary />
                    )}
                </div>
            </div>
            {styleXL && <Sparkline asset={asset} priceChangePositive={priceChangePositive} />}
        </div>
    );
};

export default AssetInfo;
