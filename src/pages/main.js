import React, { useState, useEffect } from 'react';
import '../css/Main.css';
import AssetInfo from '../components/AssetInfo';
import NavBar from '../components/NavBar';
import AsyncSelect from 'react-select/async';
import { geckoAPI } from '../constants.js';

const Main = () => {
    const [searchResult, setResult] = useState({});
    const [userAssetList, setAssetList] = useState([]);
    const [owned, setOwned] = useState(false);
    const [top20, setTop20] = useState([]);
    const [refreshed, refreshPage] = useState(false);

    useEffect(() => {
        setResult({});
        setAssetList(JSON.parse(localStorage.getItem('assetList')) || []);

        fetch(`${geckoAPI}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                setTop20(json);
            });
    }, [refreshed]);

    async function getAllCoins() {
        return await fetch(
            `${geckoAPI}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100`
        )
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                return json.map((coin) => {
                    return { label: `(${coin.symbol.toUpperCase()}) ${coin.name}`, value: coin.id };
                });
            });
    }

    function handleSearch(query) {
        if (query) {
            fetch(`${geckoAPI}coins/${query}`)
                .then((res) => {
                    return res.json();
                })
                .then((json) => {
                    if (json.error) {
                        setResult({});
                    } else {
                        searchAssetList(json.symbol);
                        setResult({
                            id: json.id,
                            name: json.name,
                            symbol: json.symbol,
                            image: json.image.small,
                            current_price: json.market_data.current_price.gbp,
                            price_change_percentage_24h:
                                json.market_data.price_change_percentage_24h,
                            updatedOn: new Date(),
                        });
                    }
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
