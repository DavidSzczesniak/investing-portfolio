import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { isPositive } from '../../Utils/helpers';
import './ValueChangePercent.scss';

export const ValueChangePercent = ({ changeValue }) => {
    const positive = isPositive(changeValue);
    return (
        <span className="value-change">
            {positive ? (
                <FontAwesomeIcon title="caret-up" className="positive" icon={faCaretUp} size="2x" />
            ) : (
                <FontAwesomeIcon
                    title="caret-down"
                    className="negative"
                    icon={faCaretDown}
                    size="2x"
                />
            )}
            <p>{changeValue.toFixed(2)}%</p>
        </span>
    );
};
