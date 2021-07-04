import React, { useEffect, useState } from 'react';
import { isPositive } from '../Utils/helpers';
import Button from './Button';
import { faStar, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faStar as faOutlineStar } from '@fortawesome/free-regular-svg-icons';
import '../css/AssetInfo.scss';
import Sparkline from './Sparkline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AssetInfo = (props) => {
    const { asset, refreshPage, refreshState, userAssetList, styleXL, click } = props;
    const [owned, setOwned] = useState(false);
    const priceChangePositive = isPositive(asset.price_change_percentage_24h);
    const currentPrice =
        asset.current_price >= 1000 ? asset.current_price.toLocaleString() : asset.current_price;

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
        <div className={`asset-container ${styleXL ? 'styleXL' : ''}`}>
            <div className="asset-header">
                <div className="asset-title" onClick={() => click && !styleXL && click()}>
                    <img src={asset.image} alt={`${asset.name} logo`} />
                    <div>
                        <span>{asset.name}</span>
                        <span className="asset-symbol">{asset.symbol.toUpperCase()}</span>
                    </div>
                </div>
                {/* <div className="asset-mcap">MCap: $348.884 Bn</div> */}
                <div className="current-price">
                    <span>${currentPrice}</span>
                    <span className="price-change">
                        {priceChangePositive ? (
                            <FontAwesomeIcon className="positive" icon={faCaretUp} size="2x" />
                        ) : (
                            <FontAwesomeIcon className="negative" icon={faCaretDown} size="2x" />
                        )}
                        <p>{asset.price_change_percentage_24h.toFixed(2)}%</p>
                    </span>
                </div>
                {owned ? (
                    <Button click={handleRemoveAsset} icon={faStar} isSecondary />
                ) : (
                    <Button click={handleSaveAsset} icon={faOutlineStar} isSecondary />
                )}
            </div>
            {styleXL && <Sparkline asset={asset} priceChangePositive={priceChangePositive} />}
        </div>
    );
};

export default AssetInfo;
