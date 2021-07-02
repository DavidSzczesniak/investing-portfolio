import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import AssetView from './pages/asset-view';
import Main from './pages/main';
import UserList from './pages/user-list';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={() => <Main />} />
                <Route path="/user-list" component={() => <UserList />} />
                <Route path="/asset-view" component={() => <AssetView />} />
            </Switch>
        </Router>
    );
};

export default App;
