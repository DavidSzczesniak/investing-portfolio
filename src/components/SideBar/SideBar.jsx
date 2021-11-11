import { faMoon, faSun, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';
import { NavButton } from '../NavButton/NavButton';
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
                <NavButton
                    icon={faTimes}
                    onClick={close}
                    ariaLabel="close sidebar menu"
                    size="3x"
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
                    <NavButton
                        icon={faMoon}
                        toggleIcon={{ otherIcon: faSun, condition: darkMode }}
                        onClick={toggleDarkMode}
                        ariaLabel="toggle dark mode"
                        size="3x"
                    />
                </div>
            </div>
        </div>
    );
};
