import React, { useState, useEffect } from 'react';
import '../css/Main.css';
import AssetInfo from '../components/AssetInfo';
import NavBar from '../components/NavBar';
import AsyncSelect from 'react-select/async';
import { geckoAPI } from '../constants.js';
import axios from 'axios';

const Main = () => {
    const [searchResult, setResult] = useState({});
    const [userAssetList, setAssetList] = useState([]);
    const [owned, setOwned] = useState(false);
    const [top20, setTop20] = useState([]);
    const [refreshed, refreshPage] = useState(false);

    useEffect(() => {
        setResult({});
        setAssetList(JSON.parse(localStorage.getItem('assetList')) || []);
        axios
            .get(`${geckoAPI}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20`)
            .then((res) => {
                setTop20(res.data);
            });
    }, [refreshed]);

    async function getAllCoins() {
        return await axios
            .get(`${geckoAPI}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100`)
            .then((res) => {
                return res.data.map((coin) => {
                    return { label: `(${coin.symbol.toUpperCase()}) ${coin.name}`, value: coin.id };
                });
            });
    }

    function handleSearch(query) {
        if (query) {
            axios.get(`${geckoAPI}coins/${query}`).then((res) => {
                const data = res.data;
                searchAssetList(data.symbol);
                setResult({
                    id: data.id,
                    name: data.name,
                    symbol: data.symbol,
                    image: data.image.small,
                    current_price: data.market_data.current_price.gbp,
                    price_change_percentage_24h: data.market_data.price_change_percentage_24h,
                    updatedOn: new Date(),
                });
            });
        }
    }

    function searchAssetList(searchedAsset) {
        setOwned(false);
        if (userAssetList.length) {
            const assetMatches = (asset) => asset.symbol === searchedAsset;
            if (userAssetList.some(assetMatches)) {
                setOwned(true);
            }
        }
    }

    return (
        <>
            <NavBar title="Home" />
            <div className="search-page">
                <AsyncSelect
                    loadOptions={getAllCoins}
                    defaultOptions
                    placeholder="Search assets..."
                    onChange={(e) => handleSearch(e.value)}
                />
                {Object.entries(searchResult).length > 0 && (
                    <AssetInfo asset={searchResult} userAssetList={userAssetList} styleXL />
                )}
                {top20.length > 0 && (
                    <>
                        <h2>Top 20</h2>
                        <div>
                            {top20.map((coin, index) => {
                                return (
                                    <AssetInfo
                                        key={index}
                                        asset={coin}
                                        refreshPage={refreshPage}
                                        refreshState={refreshed}
                                        userAssetList={userAssetList}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Main;
