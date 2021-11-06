import React from 'react';
import { useLocation } from 'react-router';
import { AssetName, AssetPrice } from '../components/AssetInfo/AssetInfo';
import { FavouritesButton } from '../components/FavouritesButton/FavouritesButton.jsx';
import { AssetChart } from '../components/AssetChart/AssetChart.jsx';
import '../css/asset-view.scss';

export const AssetView = () => {
    const query = new URLSearchParams(useLocation().search);
    const assetId = query.get('id');
    const assets = JSON.parse(localStorage.getItem('assetList'))?.list || [];
    const asset = assets.find((a) => a.id === assetId);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

    const AssetStat = ({ label, text }) => {
        return (
            <div>
                <h4>{label}</h4>
                <p>{text}</p>
            </div>
        );
    };

    return (
        <>
            {asset && (
                <>
                    <div className="asset-view__header">
                        <AssetName asset={asset} />
                        <AssetPrice asset={asset} currency={currency.symbol} />
                        <FavouritesButton asset={asset} />
                    </div>
                    <div className="asset-view__stats">
                        <AssetStat
                            label="Market Cap"
                            text={`${currency.symbol}${asset.market_cap.toLocaleString()}`}
                        />
                        <AssetStat
                            label="24 Hour Volume"
                            text={`${currency.symbol}${asset.total_volume.toLocaleString()}`}
                        />
                        {asset.total_supply && (
                            <AssetStat
                                label="Circulating Supply"
                                text={`${asset.total_supply.toLocaleString()}${asset.symbol.toUpperCase()}`}
                            />
                        )}
                    </div>
                    <AssetChart asset={asset} />
                </>
            )}
        </>
    );
};
