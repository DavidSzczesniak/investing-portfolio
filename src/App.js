import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { AssetView } from './pages/asset-view';
import { Main } from './pages/main';
import { UserList } from './pages/user-list';
import { NavBar } from './components/NavBar/NavBar';
import { Portfolio } from './components/Portfolio/Portfolio';
import axios from 'axios';
import { geckoAPI } from './constants';

export const App = () => {
    const [refreshed, refreshApp] = useState(false);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'usd',
        label: 'USD - $',
        symbol: '$',
    };

    useEffect(() => {
        const currentAssetList = JSON.parse(localStorage.getItem('assetList')) || {};
        let diffInMinutes = new Date(currentAssetList.updatedOn) - new Date();
        diffInMinutes = Math.round(diffInMinutes / 1000 / 60);

        // update prices if 5 or more minutes passed. Or set the intial prices if they aren't stored yet
        if (diffInMinutes < -4 || !currentAssetList.updatedOn) {
            getAssetPrices();
            async function getAssetPrices() {
                await axios
                    .get(
                        `${geckoAPI}coins/markets?vs_currency=${currency.value}&order=market_cap_desc&per_page=100`
                    )
                    .then((res) => {
                        localStorage.setItem(
                            'assetList',
                            JSON.stringify({ updatedOn: new Date(), list: res.data })
                        );
                    });
            }
        }
    }, [refreshed, currency.value]);

    return (
        <Router>
            <NavBar refreshed={refreshed} refreshApp={refreshApp} />
            <div className="container">
                <Switch>
                    <Route exact path="/" component={() => <Main />} />
                    <Route path="/user-list" component={() => <UserList />} />
                    <Route path="/asset-view" component={() => <AssetView />} />
                    <Route path="/portfolio" component={() => <Portfolio />} />
                </Switch>
            </div>
        </Router>
    );
};
