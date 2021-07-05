import React from 'react';
import '../css/Button.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = (props) => {
    const { label, click, icon, isSecondary } = props;
    const secondary = isSecondary ? 'secondary-btn' : '';

    return (
        <button onClick={() => click && click()} className={`${secondary} custom-btn`}>
            {icon && <FontAwesomeIcon icon={icon} />}
            {label}
        </button>
    );
};

export default Button;
