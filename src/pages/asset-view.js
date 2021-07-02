import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import AssetInfo from '../components/AssetInfo';
import { geckoAPI } from '../constants.js';
import axios from 'axios';
import { useLocation } from 'react-router';

const AssetView = () => {
    const query = new URLSearchParams(useLocation().search);
    const assetId = query.get('id');
    const [userAssetList, setAssetList] = useState([]);
    const [asset, setAssetInfo] = useState(null);

    useEffect(() => {
        setAssetList(JSON.parse(localStorage.getItem('assetList')) || []);
        axios.get(`${geckoAPI}coins/${assetId}`).then((res) => {
            const data = res.data;
            setAssetInfo({
                id: data.id,
                name: data.name,
                symbol: data.symbol,
                image: data.image.small,
                current_price: data.market_data.current_price.usd,
                price_change_percentage_24h: data.market_data.price_change_percentage_24h,
                updatedOn: new Date(),
            });
        });
    }, [assetId]);

    return (
        <>
            <NavBar />
            {asset && <AssetInfo asset={asset} userAssetList={userAssetList} styleXL />}
        </>
    );
};

export default AssetView;
