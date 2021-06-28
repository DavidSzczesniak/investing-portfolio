import React, { useEffect } from 'react';
import '../css/SearchResult.css';
import { isPositive } from '../Utils/helpers';
import Button from './Button';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faOutlineStar } from '@fortawesome/free-regular-svg-icons';

const SearchResult = (props) => {
    const { result, owned, setOwned } = props;
    const userAssetList = localStorage.getItem('assetList') || [];

    useEffect(() => {}, [owned]);

    function handleSaveAsset() {
        let currentList = JSON.parse(localStorage.getItem('assetList'));
        if (currentList) {
            currentList.push(result);
            localStorage.setItem('assetList', JSON.stringify(currentList));
        } else {
            localStorage.setItem('assetList', JSON.stringify([result]));
        }

        setOwned(true);
    }

    function handleRemoveAsset() {
        const newList = JSON.parse(userAssetList).filter((asset) => {
            return asset.symbol !== result.symbol;
        });

        localStorage.setItem('assetList', JSON.stringify(newList));

        setOwned(false);
    }

    return (
        <div className="search-result">
            <div className="result-header">
                <div className="title">
                    <img src={result.image} alt={`${result.name} logo`} />
                    <span>{result.name}</span>
                    <span className="asset-symbol">{result.symbol.toUpperCase()}</span>
                    {owned ? (
                        <Button
                            label="Remove"
                            click={handleRemoveAsset}
                            icon={faStar}
                            isSecondary
                        />
                    ) : (
                        <Button
                            label="Favourite"
                            click={handleSaveAsset}
                            icon={faOutlineStar}
                            isSecondary
                        />
                    )}
                </div>
                <div className="asset-info">
                    <div className="current-price">
                        <span>
                            £{result.price >= 1000 ? result.price.toLocaleString() : result.price}
                        </span>
                        <span
                            className={`
                            ${
                                isPositive(result.price_change['24h']) ? 'positive' : 'negative'
                            } price-change
                        `}>
                            {result.price_change['24h']}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
