import React, { useState, useEffect } from 'react';
import '../css/UserList.css';
import '../css/SearchResult.css';
import { isPositive } from '../Utils/helpers';
import Button from '../components/Button';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../components/NavBar';
import InfoPage from '../components/InfoPage';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const UserList = () => {
    const [userAssetList, setAssetList] = useState([]);
    const [refreshed, refreshPortfolio] = useState(false);

    useEffect(() => {
        setAssetList(JSON.parse(localStorage.getItem('assetList')) || []);
    }, [refreshed]);

    function handleRemoveAsset(symbol) {
        const newList = userAssetList.filter((asset) => {
            return asset.symbol !== symbol;
        });

        localStorage.setItem('assetList', JSON.stringify(newList));
        refreshPortfolio(!refreshed);
    }

    return (
        <div className="user-list">
            <NavBar title="Your Watchlist" />
            {userAssetList.length > 0 ? (
                <div>
                    {userAssetList.map((asset, index) => {
                        return (
                            <div className="asset-container" key={index}>
                                <div className="asset-header">
                                    <div className="title">
                                        <img src={asset.thumb} alt={`${asset.name} logo`} />
                                        <span>{asset.name}</span>
                                        <span className="asset-symbol">
                                            {asset.symbol.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="asset-info">
                                        <div className="current-price">
                                            <span>
                                                £
                                                {asset.price >= 1000
                                                    ? asset.price.toLocaleString()
                                                    : asset.price}
                                            </span>
                                            <span
                                                className={`
                            ${
                                isPositive(asset.price_change['24h']) ? 'positive' : 'negative'
                            } price-change
                        `}>
                                                {asset.price_change['24h']}%
                                            </span>
                                            <Button
                                                label="Remove"
                                                click={() => handleRemoveAsset(asset.symbol)}
                                                icon={faStar}
                                                isSecondary
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <InfoPage
                    title="Woops! Nothing here!"
                    message="It looks like you haven't saved anything to your portfolio yet."
                    icon={faQuestionCircle}
                />
            )}
        </div>
    );
};

export default UserList;
