import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { geckoAPI } from '../constants';
import '../css/NavBar.scss';

const UserList = () => {
    const history = useHistory();
    const [coins, setCoins] = useState([]);

    useEffect(() => {
        getCoins();
    }, []);

    async function getCoins() {
        const result = await axios
            .get(`${geckoAPI}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100`)
            .then((res) => {
                return res.data.map((coin) => {
                    return {
                        value: coin.id,
                        label: `(${coin.symbol.toUpperCase()}) ${coin.name}`,
                    };
                });
            });
        setCoins(result);
    }

    function handleSearch(query) {
        if (query) {
            history.replace(`/asset-view?id=${query}`);
        }
    }

    return (
        <div className="navbar">
            <div className="nav-container">
                <h2 className="site-logo" onClick={() => history.replace('/')}>
                    Investii
                </h2>
                <div className="nav-btn" onClick={() => history.replace('/user-list')}>
                    Watchlist
                </div>
                <div className="nav-btn">Portfolio</div>
            </div>
            {coins.length > 0 && (
                <div className="search-container">
                    <Select
                        options={coins}
                        placeholder="Search assets..."
                        onChange={(e) => handleSearch(e.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default UserList;
