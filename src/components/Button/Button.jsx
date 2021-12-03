import React from 'react';
import './Button.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Button = ({
    label,
    onClick,
    icon,
    iconSize = '1x',
    toggleIcon,
    isSecondary,
    ariaLabel,
    className,
    type,
    testId,
}) => {
    const secondary = isSecondary ? 'secondary-btn' : '';
    const iconOnly = !label ? 'icon-only' : '';

    if (toggleIcon?.condition) {
        icon = toggleIcon.otherIcon;
    }

    return (
        <button
            data-testid={`custom-btn ${testId}`}
            onClick={() => onClick && onClick()}
            aria-label={ariaLabel}
            type={`${type ? type : 'button'}`}
            className={`${secondary} ${iconOnly} ${className} custom-btn`}>
            {icon && <FontAwesomeIcon icon={icon} size={iconSize} />}
            {label}
        </button>
    );
};
