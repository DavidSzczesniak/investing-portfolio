import React from 'react';
import './Button.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Button = ({ label, onClick, icon, isSecondary }) => {
    const secondary = isSecondary ? 'secondary-btn' : '';

    return (
        <button
            data-testid="custom-btn"
            onClick={() => onClick && onClick()}
            className={`${secondary} custom-btn`}>
            {icon && <FontAwesomeIcon icon={icon} />}
            {label}
        </button>
    );
};
