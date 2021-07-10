import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { geckoAPI } from '../constants';
import '../css/NavBar.scss';

const UserList = (props) => {
    const { refreshed, refreshApp } = props;
    const history = useHistory();
    const currencyList = [
        { value: 'usd', label: 'USD - $', symbol: '$' },
        { value: 'gbp', label: 'GBP - £', symbol: '£' },
        { value: 'eur', label: 'EUR - €', symbol: '€' },
        { value: 'cad', label: 'CAD - $', symbol: '$' },
    ];
    const [coins, setCoins] = useState([]);
    const [currency, setCurrency] = useState(
        JSON.parse(localStorage.getItem('currency')) || currencyList[0]
    );

    useEffect(() => {
        localStorage.setItem('currency', JSON.stringify(currency));
        getCoins();
        async function getCoins() {
            const result = await axios
                .get(
                    `${geckoAPI}coins/markets?vs_currency=${currency.value}&order=market_cap_desc&per_page=100`
                )
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
    }, [currency.value, currency]);

    function handleSearch(query) {
        if (query) {
            history.replace(`/asset-view?id=${query}`);
        }
    }

    function changeCurrency(selectedCurrency) {
        localStorage.setItem('currency', JSON.stringify(selectedCurrency));
        setCurrency(selectedCurrency);
        refreshApp(!refreshed);
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
                    <Select
                        options={currencyList}
                        defaultValue={currency}
                        onChange={(e) => changeCurrency(e)}
                    />
                </div>
            )}
        </div>
    );
};

export default UserList;
