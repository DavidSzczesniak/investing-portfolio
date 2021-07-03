import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router';
import AsyncSelect from 'react-select/async';
import { geckoAPI } from '../constants';
import '../css/NavBar.scss';

const UserList = (props) => {
    const history = useHistory();

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
        <div>
            <div className="navbar">
                <div className="nav-container">
                    <span className="site-logo" onClick={() => history.replace('/')}>
                        Investii
                    </span>
                    <div className="search-container">
                        <AsyncSelect
                            loadOptions={getAllCoins}
                            defaultOptions
                            placeholder="Search assets..."
                            onChange={(e) => handleSearch(e.value)}
                        />
                    </div>
                </div>
                <div>
                    <div className="nav-btn" onClick={() => history.replace('/user-list')}>
                        Watchlist
                    </div>
                    <div className="nav-btn">Portfolio</div>
                </div>
            </div>
            {props.title && <div className="page-title">{props.title}</div>}
        </div>
    );
};

export default UserList;
