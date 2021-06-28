import React from 'react';
import Button from '../components/Button';
import '../css/NavBar.css';
import { useHistory } from 'react-router';

const UserList = (props) => {
    const history = useHistory();
    return (
        <div>
            <div className="navbar">
                <span className="site-logo" onClick={() => history.replace('/')}>
                    Investii
                </span>
                <div>
                    <Button label="Watchlist" click={() => history.replace('/user-list')} />
                </div>
            </div>
            <div className="page-title">{props.title}</div>
        </div>
    );
};

export default UserList;
