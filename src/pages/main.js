import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import AssetInfo from '../components/AssetInfo';
import NavBar from '../components/NavBar';
import { geckoAPI } from '../constants.js';
import '../css/Main.scss';

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

    return (
        <>
            <NavBar />
            <div className="home-page">
                {top20.length > 0 && (
                    <>
                        <h2>Top 20 by Market Cap</h2>
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
