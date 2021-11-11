import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './NavButton.scss';

export const NavButton = ({ icon, size = '2x', toggleIcon, className, onClick, ariaLabel }) => {
    if (toggleIcon?.condition) {
        icon = toggleIcon.otherIcon;
    }

    const classNames = `nav-button ${className}`;

    return (
        <button className={classNames} onClick={onClick} aria-label={ariaLabel}>
            <FontAwesomeIcon icon={icon} size={size} />
        </button>
    );
};
