import { faMoon, faSun, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../Modal/Modal';
import { disableScrolling, enableScrolling } from '../../Utils/helpers';
import { Button } from '../Button/Button';
import { CurrencyList } from '../CurrencyList/CurrencyList';
import './SideBar.scss';

export const SideBar = ({ refreshed, refreshApp, close }) => {
    const history = useHistory();
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);
    const defaultCurrency = { value: 'USD', label: 'United States Dollar', symbol: '$' };
    const selectedCurrency = JSON.parse(localStorage.getItem('currency')) || defaultCurrency;
    const { open, openModal, closeModal } = useModal();

    useEffect(() => {
        disableScrolling();
        if (darkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [darkMode, selectedCurrency]);

    function toggleDarkMode() {
        localStorage.setItem('darkMode', !darkMode);
        setDarkMode(!darkMode);
    }

    function closeSideBar() {
        enableScrolling();
        close();
    }

    return (
        <>
            {open && (
                <Modal close={closeModal}>
                    <CurrencyList
                        refreshApp={refreshApp}
                        refreshed={refreshed}
                        close={closeModal}
                    />
                </Modal>
            )}
            <div className="sidebar">
                <div className="sidebar-header">
                    <div
                        className="site-logo"
                        onClick={() => {
                            history.replace('/');
                            enableScrolling();
                            close();
                        }}>
                        Investii
                    </div>
                    <Button
                        onClick={closeSideBar}
                        icon={faTimes}
                        ariaLabel="close sidebar menu"
                        className="sidebar-button"
                    />
                </div>
                <ul className="sidebar-links">
                    <li>
                        <NavLink exact to="/user-list" onClick={closeSideBar}>
                            Watchlist
                        </NavLink>
                    </li>
                    <li>
                        <NavLink exact to="/portfolio" onClick={closeSideBar}>
                            Portfolio
                        </NavLink>
                    </li>
                </ul>
                <div className="sidebar-actions">
                    <div>
                        <button
                            onClick={openModal}
                            type="button"
                            className="change-currency nav-button">
                            {selectedCurrency.value}
                        </button>
                    </div>
                    <div>
                        <Button
                            onClick={toggleDarkMode}
                            icon={faMoon}
                            toggleIcon={{ otherIcon: faSun, condition: darkMode }}
                            ariaLabel="toggle dark mode"
                            className="sidebar-button"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
