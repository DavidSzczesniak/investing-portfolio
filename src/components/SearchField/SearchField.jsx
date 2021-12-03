import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from '../Button/Button';
import './SearchField.scss';

export const SearchField = ({ inputValue, onChange, clearSearch, size = 'md', style }) => {
    return (
        <div className={`search-field ${size}`} style={style} data-testid="search-field">
            <FontAwesomeIcon icon={faSearch} />
            <input
                type="text"
                placeholder="Search"
                onChange={onChange}
                value={inputValue || ''}
                className={inputValue ? 'with-results' : undefined}
                autoFocus
            />
            <Button icon={faTimesCircle} onClick={clearSearch} testId="clear-search" />
        </div>
    );
};
