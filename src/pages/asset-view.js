import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { AssetName, AssetPrice } from '../components/AssetInfo/AssetInfo';
import { FavouritesButton } from '../components/FavouritesButton/FavouritesButton.jsx';
import { Sparkline } from '../components/Sparkline.jsx';
import { geckoAPI } from '../constants.js';
import '../css/asset-view.scss';

export const AssetView = () => {
    const query = new URLSearchParams(useLocation().search);
    const assetId = query.get('id');
    const [asset, setAssetInfo] = useState(null);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

    useEffect(() => {
        axios.get(`${geckoAPI}coins/${assetId}`).then((res) => {
            const data = res.data;
            const marketData = data.market_data;
            setAssetInfo({
                id: data.id,
                name: data.name,
                symbol: data.symbol,
                image: data.image.small,
                current_price: marketData.current_price[currency.value],
                price_change_percentage_24h: marketData.price_change_percentage_24h,
                market_cap: marketData.market_cap[currency.value].toLocaleString(),
                volume: marketData.total_volume[currency.value].toLocaleString(),
                supply: marketData.circulating_supply.toLocaleString(),
                updatedOn: new Date(),
            });
        });
    }, [assetId, currency.value]);

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
                            text={`${currency.symbol}${asset.market_cap}`}
                        />
                        <AssetStat
                            label="24 Hour Volume"
                            text={`${currency.symbol}${asset.volume}`}
                        />
                        <AssetStat
                            label="Circulating Supply"
                            text={`${asset.supply}${asset.symbol.toUpperCase()}`}
                        />
                    </div>
                    <Sparkline asset={asset} />
                </>
            )}
        </>
    );
};
