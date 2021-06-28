import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Main from './pages/main';
import UserList from './pages/user-list';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={() => <Main />} />
                <Route path="/user-list" component={() => <UserList />} />
            </Switch>
        </Router>
    );
};

export default App;
