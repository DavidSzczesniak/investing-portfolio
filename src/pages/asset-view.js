import React, { useState, useEffect } from 'react';
import AssetInfo from '../components/AssetInfo/AssetInfo';
import { geckoAPI } from '../constants.js';
import axios from 'axios';
import { useLocation } from 'react-router';

const AssetView = () => {
    const query = new URLSearchParams(useLocation().search);
    const assetId = query.get('id');
    const [userAssetList, setAssetList] = useState([]);
    const [asset, setAssetInfo] = useState(null);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

    useEffect(() => {
        setAssetList(JSON.parse(localStorage.getItem('assetList')) || []);
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

    return <>{asset && <AssetInfo asset={asset} userAssetList={userAssetList} styleXL />}</>;
};

export default AssetView;
