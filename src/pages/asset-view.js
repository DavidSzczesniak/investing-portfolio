import React from 'react';
import { useLocation } from 'react-router';
import { AssetChart } from '../components/AssetChart/AssetChart.jsx';
import { AssetName, AssetPrice } from '../components/AssetInfo/AssetInfo';
import { FavouritesButton } from '../components/FavouritesButton/FavouritesButton.jsx';
import '../css/asset-view.scss';
import { compactNumber } from '../Utils/helpers';

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

    const marketStats = [
        {
            label: 'Market Cap',
            value: asset.market_cap,
        },
        {
            label: '24h Volume',
            value: asset.total_volume,
        },
        {
            label: 'All Time High',
            value: asset.ath,
        },
        {
            label: 'All Time Low',
            value: asset.atl,
        },
        {
            label: 'Market Rank',
            value: `#${asset.market_cap_rank}`,
            formatNumber: false,
        },
    ];

    // coingecko doesn't has these props for all coins for whatever reason,
    // and they're inaccurate, will change API later
    if (asset.total_supply) {
        marketStats.push({
            label: 'Circulating Supply',
            value: `${compactNumber(asset.total_supply)} ${asset.symbol.toUpperCase()}`,
            formatNumber: false,
        });
    }

    if (asset.max_supply) {
        marketStats.push({
            label: 'Max Supply',
            value: `${compactNumber(asset.max_supply)} ${asset.symbol.toUpperCase()}`,
            formatNumber: false,
        });
    }

    const AssetStat = ({ label, value, formatNumber = true }) => {
        return (
            <div>
                <h4>{label}</h4>
                <p>{formatNumber ? `${currency.symbol}${value.toLocaleString()}` : value}</p>
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
                    <div className="asset-view__content">
                        <AssetChart asset={asset} />
                        <div className="asset-view__stats">
                            <h3>Market Stats</h3>
                            {marketStats.map((stat, index) => {
                                return (
                                    <AssetStat
                                        key={index}
                                        label={stat.label}
                                        value={stat.value}
                                        formatNumber={stat.formatNumber}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
