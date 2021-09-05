import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AssetTable } from '../components/AssetTable/AssetTable';
import { geckoAPI } from '../constants.js';

export const Main = () => {
    const [top20, setTop20] = useState([]);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

    useEffect(() => {
        axios
            .get(
                `${geckoAPI}coins/markets?vs_currency=${currency.value}&order=market_cap_desc&per_page=20`
            )
            .then((res) => {
                setTop20(res.data);
            });
    }, [currency.value]);

    return (
        <>
            {top20.length > 0 && (
                <>
                    <h2 className="page-title">Top 20 by Market Cap</h2>
                    <AssetTable assets={top20} favourites />
                </>
            )}
        </>
    );
};
