import { faBars, faMoon, faSearch, faSun } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../Modal/Modal';
import { AssetSearch } from '../AssetSearch/AssetSearch';
import { Button } from '../Button/Button';
import { CurrencyList } from '../CurrencyList/CurrencyList';
import './NavBar.scss';

export const NavBar = ({ refreshApp, refreshed, toggleSideBar }) => {
    const history = useHistory();
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);
    const defaultCurrency = { value: 'USD', label: 'United States Dollar', symbol: '$' };
    const selectedCurrency = JSON.parse(localStorage.getItem('currency')) || defaultCurrency;
    const { open, modalType, openModal, closeModal } = useModal();
    const assetList = JSON.parse(localStorage.getItem('assetList'))?.list || [];

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('currency', JSON.stringify(selectedCurrency));
    }, [darkMode, selectedCurrency]);

    function toggleDarkMode() {
        localStorage.setItem('darkMode', !darkMode);
        setDarkMode(!darkMode);
    }

    return (
        <>
            {open && modalType && (
                <Modal close={closeModal}>
                    {modalType === 'search' ? (
                        <AssetSearch searchOptions={assetList} close={closeModal} />
                    ) : (
                        modalType === 'currency' && (
                            <CurrencyList
                                refreshApp={refreshApp}
                                refreshed={refreshed}
                                close={closeModal}
                            />
                        )
                    )}
                </Modal>
            )}
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
                            onClick={() => openModal('search')}
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
                        <button
                            onClick={() => openModal('currency')}
                            type="button"
                            className="change-currency nav-button">
                            {selectedCurrency.value}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
