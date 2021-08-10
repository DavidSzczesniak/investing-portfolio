import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import AssetInfo from '../components/AssetInfo/AssetInfo';
import { geckoAPI } from '../constants.js';

const Main = () => {
    const [userAssetList, setAssetList] = useState([]);
    const [top20, setTop20] = useState([]);
    const [refreshed, refreshPage] = useState(false);
    const history = useHistory();
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

    useEffect(() => {
        setAssetList(JSON.parse(localStorage.getItem('assetList')) || []);
        axios
            .get(
                `${geckoAPI}coins/markets?vs_currency=${currency.value}&order=market_cap_desc&per_page=20`
            )
            .then((res) => {
                setTop20(res.data);
            });
    }, [refreshed, currency.value]);

    return (
        <>
            {top20.length > 0 && (
                <>
                    <h2 className="page-title">Top 20 by Market Cap</h2>
                    <div className="asset-list">
                        {top20.map((coin, index) => {
                            return (
                                <AssetInfo
                                    key={index}
                                    asset={coin}
                                    refreshPage={refreshPage}
                                    refreshState={refreshed}
                                    userAssetList={userAssetList}
                                    onClick={() => history.replace(`/asset-view?id=${coin.id}`)}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
};

export default Main;
