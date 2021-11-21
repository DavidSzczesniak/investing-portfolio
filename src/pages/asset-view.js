import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { AssetChart } from '../components/AssetChart/AssetChart.jsx';
import { AssetName, AssetPrice } from '../components/AssetInfo/AssetInfo';
import { FavouritesButton } from '../components/FavouritesButton/FavouritesButton.jsx';
import { geckoAPI } from '../constants.js';
import '../css/asset-view.scss';
import { compactNumber } from '../Utils/helpers';

export const AssetView = () => {
    const query = new URLSearchParams(useLocation().search);
    const assetId = query.get('id');
    const [asset, setAsset] = useState(undefined);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

    useEffect(() => {
        axios.get(`${geckoAPI}coins/${assetId}`).then((res) => {
            const coin = res.data;
            const marketData = coin.market_data;
            const currencyVal = currency.value.toLowerCase();

            setAsset({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                current_price: marketData.current_price[currencyVal],
                image: coin.image.large,
                price_change_percentage_24h: marketData.price_change_percentage_24h,
                market_cap: marketData.market_cap[currencyVal],
                total_volume: marketData.total_volume[currencyVal],
                ath: marketData.ath[currencyVal],
                atl: marketData.atl[currencyVal],
                market_cap_rank: coin.market_cap_rank,
                ...(marketData.total_supply && {
                    total_supply: marketData.total_supply,
                }),
                ...(marketData.max_supply && { max_supply: marketData.max_supply }),
            });
        });
    }, [assetId, currency.value]);

    const marketStats = [
        {
            label: 'Market Cap',
            value: asset?.market_cap,
        },
        {
            label: '24h Volume',
            value: asset?.total_volume,
        },
        {
            label: 'All Time High',
            value: asset?.ath,
        },
        {
            label: 'All Time Low',
            value: asset?.atl,
        },
        {
            label: 'Market Rank',
            value: `#${asset?.market_cap_rank}`,
            formatNumber: false,
        },
    ];

    // coingecko doesn't has these props for all coins for whatever reason,
    // and they're inaccurate, will change API later
    if (asset?.total_supply) {
        marketStats.push({
            label: 'Circulating Supply',
            value: `${compactNumber(asset.total_supply)} ${asset.symbol.toUpperCase()}`,
            formatNumber: false,
        });
    }

    if (asset?.max_supply) {
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
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <FavouritesButton asset={asset} />
                        </span>
                    </div>
                    <div className="asset-view__content">
                        <AssetChart asset={asset} />
                        <div className="foreground-panel asset-view__stats">
                            <header>
                                <FontAwesomeIcon icon={faChartBar} />
                                <h3>Market Stats</h3>
                            </header>
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
