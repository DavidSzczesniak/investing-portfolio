import { faMoon, faSun, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Button } from '../Button/Button';
import './SideBar.scss';

export const SideBar = ({ close }) => {
    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || false);
    const history = useHistory();

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [darkMode]);

    function toggleDarkMode() {
        localStorage.setItem('darkMode', !darkMode);
        setDarkMode(!darkMode);
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div
                    className="site-logo"
                    onClick={() => {
                        history.replace('/');
                        close();
                    }}>
                    Investii
                </div>
                <Button
                    onClick={close}
                    icon={faTimes}
                    ariaLabel="close sidebar menu"
                    className="sidebar-button"
                />
            </div>
            <ul className="sidebar-links">
                <li>
                    <NavLink exact to="/user-list" onClick={close}>
                        Watchlist
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/portfolio" onClick={close}>
                        Portfolio
                    </NavLink>
                </li>
            </ul>
            <div className="sidebar-actions">
                <div>
                    {/* placeholder */}
                    <button className="change-currency">USD</button>
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
    );
};
