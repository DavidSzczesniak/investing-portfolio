import { faBars, faMoon, faSearch, faSun } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import './NavBar.scss';
import { Button } from '../Button/Button';

export const NavBar = ({ toggleSideBar, openSearch }) => {
    const history = useHistory();
    const currencyList = [
        { value: 'usd', label: 'USD - $', symbol: '$' },
        { value: 'gbp', label: 'GBP - £', symbol: '£' },
        { value: 'eur', label: 'EUR - €', symbol: '€' },
        { value: 'cad', label: 'CAD - $', symbol: '$' },
    ];
    const [currency, setCurrency] = useState(
        JSON.parse(localStorage.getItem('currency')) || currencyList[0]
    );
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('currency', JSON.stringify(currency));
    }, [currency.value, currency, darkMode]);

    // function changeCurrency(selectedCurrency) {
    //     localStorage.setItem('currency', JSON.stringify(selectedCurrency));
    //     setCurrency(selectedCurrency);
    //     refreshApp(!refreshed);
    // }

    function toggleDarkMode() {
        localStorage.setItem('darkMode', !darkMode);
        setDarkMode(!darkMode);
    }

    return (
        <div className="navbar" data-testid="navbar">
            <div className="site-logo" onClick={() => history.replace('/')}>
                Investii
            </div>
            <div className="nav-content">
                <ul className="nav-links">
                    <li>
                        <NavLink exact to="/user-list">
                            Watchlist
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/portfolio">
                            Portfolio
                        </NavLink>
                    </li>
                </ul>
                <div className="nav-btns">
                    <Button
                        onClick={openSearch}
                        icon={faSearch}
                        ariaLabel="search"
                        className="nav-button"
                    />
                    <Button
                        onClick={toggleDarkMode}
                        icon={faMoon}
                        toggleIcon={{ otherIcon: faSun, condition: darkMode }}
                        ariaLabel="toggle dark mode"
                        className="nav-button dark-mode-toggle"
                    />
                    <Button
                        onClick={toggleSideBar}
                        icon={faBars}
                        ariaLabel="open sidebar menu"
                        className="nav-button hamburger"
                    />
                    <button className="change-currency nav-button">USD</button>
                </div>
            </div>
        </div>
    );
};
