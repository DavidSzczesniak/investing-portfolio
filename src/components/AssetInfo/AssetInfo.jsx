import React from 'react';
import { useHistory } from 'react-router-dom';
import { normalizeNumber } from '../../Utils/helpers';
import { ValueChangePercent } from '../ValueChangePercent/ValueChangePercent';
import './AssetInfo.scss';

export const AssetName = ({ asset, disableClick }) => {
    const history = useHistory();

    function handleClick() {
        if (!disableClick) {
            history.replace(`/asset-view?id=${asset.id}`);
        }
    }

    return (
        <div data-testid="asset-name" className="asset-name" onClick={handleClick}>
            <img src={asset.image} alt={`${asset.name} logo`} />
            <div>
                <span>{asset.name}</span>
                <span className="asset-symbol">{asset.symbol.toUpperCase()}</span>
            </div>
        </div>
    );
};

export const AssetPrice = ({ asset, currency }) => {
    return (
        <div className="asset-price">
            <span>
                {currency}
                {normalizeNumber(asset.current_price, 4)}
            </span>
            <ValueChangePercent changeValue={asset.price_change_percentage_24h} />
        </div>
    );
};

export const AssetHoldings = ({ asset, currency }) => {
    return (
        <div className="asset-holdings">
            <span>
                {currency}
                {normalizeNumber(asset.amount * asset.current_price, 2)}
            </span>
            <span className="asset-symbol">
                {asset.amount || 0} {asset.symbol.toUpperCase()}
            </span>
        </div>
    );
};
