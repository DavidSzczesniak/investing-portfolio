import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { AssetView } from './pages/asset-view';
import { Main } from './pages/main';
import { UserList } from './pages/user-list';
import { NavBar } from './components/NavBar/NavBar';

export const App = () => {
    const [refreshed, refreshApp] = useState(false);

    useEffect(() => {}, [refreshed]);

    return (
        <Router>
            <NavBar refreshed={refreshed} refreshApp={refreshApp} />
            <div className="container">
                <Switch>
                    <Route exact path="/" component={() => <Main />} />
                    <Route path="/user-list" component={() => <UserList />} />
                    <Route path="/asset-view" component={() => <AssetView />} />
                </Switch>
            </div>
        </Router>
    );
};
