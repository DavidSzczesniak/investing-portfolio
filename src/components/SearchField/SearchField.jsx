import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from '../Button/Button';
import './SearchField.scss';

export const SearchField = ({ inputValue, onChange, clearSearch, size = 'md', style }) => {
    return (
        <div className={`search-field ${size}`} style={style}>
            <FontAwesomeIcon icon={faSearch} />
            <input
                type="text"
                placeholder="Search"
                onChange={onChange}
                value={inputValue || ''}
                className={inputValue && 'with-results'}
                autoFocus
            />
            <Button icon={faTimesCircle} onClick={clearSearch} />
        </div>
    );
};
