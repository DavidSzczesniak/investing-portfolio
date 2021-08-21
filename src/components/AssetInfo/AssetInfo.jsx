import React, { useEffect, useState } from 'react';
import { isPositive } from '../../Utils/helpers';
import { faStar, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faStar as faOutlineStar } from '@fortawesome/free-regular-svg-icons';
import './AssetInfo.scss';
import Sparkline from '../Sparkline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AssetInfo = ({ asset, refreshPage, refreshState, userAssetList, styleXL, onClick }) => {
    const [owned, setOwned] = useState(false);
    const priceChangePositive = isPositive(asset.price_change_percentage_24h);
    const currentPrice =
        asset.current_price >= 1000 ? asset.current_price.toLocaleString() : asset.current_price;
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

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
        <div data-testid="asset-info" className={`asset-container ${styleXL ? 'styleXL' : ''}`}>
            <div className="asset-header">
                <div
                    data-testid="asset-title"
                    className="asset-title"
                    onClick={() => onClick && !styleXL && onClick()}>
                    <img src={asset.image} alt={`${asset.name} logo`} />
                    <div>
                        <span>{asset.name}</span>
                        <span className="asset-symbol">{asset.symbol.toUpperCase()}</span>
                    </div>
                </div>
                <div className="current-price">
                    <span>
                        {currency.symbol}
                        {currentPrice}
                    </span>
                    <span className="price-change">
                        {priceChangePositive ? (
                            <FontAwesomeIcon
                                title="caret-up"
                                className="positive"
                                icon={faCaretUp}
                                size="2x"
                            />
                        ) : (
                            <FontAwesomeIcon
                                title="caret-down"
                                className="negative"
                                icon={faCaretDown}
                                size="2x"
                            />
                        )}
                        <p>{asset.price_change_percentage_24h.toFixed(2)}%</p>
                    </span>
                </div>
                {owned ? (
                    <button
                        data-testid="remove-asset"
                        onClick={handleRemoveAsset}
                        aria-label="Remove from Favourites">
                        <FontAwesomeIcon icon={faStar} />
                    </button>
                ) : (
                    <button
                        data-testid="save-asset"
                        onClick={handleSaveAsset}
                        aria-label="Add to Favourites">
                        <FontAwesomeIcon icon={faOutlineStar} />
                    </button>
                )}
            </div>
            {styleXL && (
                <>
                    <div className="asset-market-stats">
                        <div>
                            <h4>Market Cap</h4>
                            <p>
                                {currency.symbol}
                                {asset.market_cap}
                            </p>
                        </div>
                        <div>
                            <h4>24 Hour Volume</h4>
                            <p>
                                {currency.symbol}
                                {asset.volume}
                            </p>
                        </div>
                        <div>
                            <h4>Circulating Supply</h4>
                            <p>
                                {asset.supply} {asset.symbol.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <Sparkline asset={asset} priceChangePositive={priceChangePositive} />
                </>
            )}
        </div>
    );
};

export default AssetInfo;
