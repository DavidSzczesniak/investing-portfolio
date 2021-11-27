import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import { Portfolio } from './components/Portfolio/Portfolio';
import { SideBar } from './components/SideBar/SideBar';
import { geckoAPI } from './constants';
import { AssetView } from './pages/asset-view';
import { Main } from './pages/main';
import { UserList } from './pages/user-list';

export const App = () => {
    const [refreshed, refreshApp] = useState(false);
    const currency = JSON.parse(localStorage.getItem('currency')) || {
        value: 'USD',
        label: 'United States Dollar',
        symbol: '$',
    };
    const [showSideBar, setShowSideBar] = useState(false);

    useEffect(() => {
        const currentAssetList = JSON.parse(localStorage.getItem('assetList')) || {};
        let diffInMinutes = new Date(currentAssetList.updatedOn) - new Date();
        diffInMinutes = Math.round(diffInMinutes / 1000 / 60);

        // update prices if 5 or more minutes passed.
        // OR set the intial prices if they aren't stored yet
        // OR request again if the currency was changed by the user
        if (
            diffInMinutes < -4 ||
            !currentAssetList.updatedOn ||
            currency.value !== currentAssetList.currency
        ) {
            getAssetPrices();
            async function getAssetPrices() {
                await axios
                    .get(
                        `${geckoAPI}coins/markets?vs_currency=${currency.value}&order=market_cap_desc&per_page=250`
                    )
                    .then((res) => {
                        localStorage.setItem(
                            'assetList',
                            JSON.stringify({
                                updatedOn: new Date(),
                                list: res.data,
                                currency: currency.value,
                            })
                        );
                        window.location.reload();
                    });
            }
        }
    }, [refreshed, currency.value]);

    return (
        <Router>
            {showSideBar ? (
                <SideBar
                    refreshed={refreshed}
                    refreshApp={refreshApp}
                    close={() => setShowSideBar(false)}
                />
            ) : (
                <NavBar
                    refreshed={refreshed}
                    refreshApp={refreshApp}
                    toggleSideBar={() => setShowSideBar(!showSideBar)}
                />
            )}
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        <Main />
                    </Route>
                    <Route path="/user-list">
                        <UserList />
                    </Route>
                    <Route path="/asset-view">
                        <AssetView />
                    </Route>
                    <Route path="/portfolio">
                        <Portfolio />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};
