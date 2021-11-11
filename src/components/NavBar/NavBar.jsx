import { faBars, faMoon, faSearch, faSun } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router';
// import Select from 'react-select';
import './NavBar.scss';
import { NavButton } from '../NavButton/NavButton';

export const NavBar = ({ refreshed, refreshApp, toggleSideBar }) => {
    const history = useHistory();
    const currencyList = [
        { value: 'usd', label: 'USD - $', symbol: '$' },
        { value: 'gbp', label: 'GBP - £', symbol: '£' },
        { value: 'eur', label: 'EUR - €', symbol: '€' },
        { value: 'cad', label: 'CAD - $', symbol: '$' },
    ];
    let assets =
        JSON.parse(localStorage.getItem('assetList'))
            ?.list.slice(0, 20)
            .map((asset) => ({
                value: asset.id,
                label: `${asset.symbol.toUpperCase()} - ${asset.name}`,
            })) || [];

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

    // function handleSearch(query) {
    //     if (query) {
    //         history.replace(`/asset-view?id=${query}`);
    //     }
    // }

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
                    <NavButton icon={faSearch} ariaLabel="search" />
                    <NavButton
                        icon={faMoon}
                        toggleIcon={{ otherIcon: faSun, condition: darkMode }}
                        onClick={toggleDarkMode}
                        className="dark-mode-toggle"
                        ariaLabel="toggle dark mode"
                        size="2x"
                    />
                    <NavButton
                        icon={faBars}
                        className="hamburger"
                        onClick={toggleSideBar}
                        ariaLabel="toggle sidebar menu display"
                    />
                    {/*  placeholder */}
                    <button className="change-currency nav-button">USD</button>
                </div>
            </div>
            {/* {assets.length > 0 && (
                <div className="search-container">
                    <Select
                        options={assets}
                        placeholder="Search assets..."
                        onChange={(e) => handleSearch(e.value)}
                    />
                    <Select
                        options={currencyList}
                        defaultValue={currency}
                        onChange={(e) => changeCurrency(e)}
                    />
                    <div className="dark-mode-toggle">
                        <button onClick={toggleDarkMode} aria-label="toggle dark mode">
                            {darkMode ? (
                                <FontAwesomeIcon icon={faSun} size="2x" />
                            ) : (
                                <FontAwesomeIcon icon={faMoon} size="2x" />
                            )}
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
};
