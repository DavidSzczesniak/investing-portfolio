import React, { useState, useEffect } from 'react';
import '../css/Main.css';
import AssetInfo from '../components/AssetInfo';
import NavBar from '../components/NavBar';
import AsyncSelect from 'react-select/async';
import { geckoAPI } from '../constants.js';
import axios from 'axios';
import { useHistory } from 'react-router';

const Main = () => {
    const [userAssetList, setAssetList] = useState([]);
    const [top20, setTop20] = useState([]);
    const [refreshed, refreshPage] = useState(false);
    const history = useHistory();

    useEffect(() => {
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
            history.replace(`/asset-view?id=${query}`);
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
                                        click={() => history.replace(`/asset-view?id=${coin.id}`)}
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
