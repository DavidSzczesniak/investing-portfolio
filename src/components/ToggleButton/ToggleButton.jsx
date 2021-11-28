import React, { useState } from 'react';
import './ToggleButton.scss';

export const ToggleButton = ({ defaultOption, options, onClick }) => {
    const [current, setCurrent] = useState(defaultOption || options[0].value);

    function handleClick(option) {
        setCurrent(option.value);
        onClick && onClick(option);
    }

    return (
        <div className="toggle-btn" data-testid="toggle-btn">
            {options.map((option, index) => {
                return (
                    <button
                        key={index}
                        className={`${current === option.value ? 'selected' : ''}`}
                        onClick={() => handleClick(option)}>
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
