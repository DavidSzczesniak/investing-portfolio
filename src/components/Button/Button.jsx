import React from 'react';
import './Button.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Button = ({
    label,
    onClick,
    icon,
    isSecondary,
    ariaLabel,
    className,
    iconSize = '1x',
    type,
}) => {
    const secondary = isSecondary ? 'secondary-btn' : '';
    const iconOnly = !label ? 'icon-only' : '';

    return (
        <button
            data-testid="custom-btn"
            onClick={() => onClick && onClick()}
            aria-label={ariaLabel}
            type={`${type ? type : 'button'}`}
            className={`${secondary} ${iconOnly} ${className} custom-btn`}>
            {icon && <FontAwesomeIcon icon={icon} size={iconSize} />}
            {label}
        </button>
    );
};
