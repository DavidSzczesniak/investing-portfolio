import React from 'react';
import { useHistory } from 'react-router';
import { Button } from '../Button/Button';
import './InfoPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const InfoPage = ({ title, message, icon }) => {
    const history = useHistory();

    return (
        <div className="info-page">
            {icon && <FontAwesomeIcon icon={icon} size="10x" />}
            <h2>{title}</h2>
            <div className="info-page__message">{message}</div>
            {title.startsWith('Woops!') && (
                <Button label="Search" onClick={() => history.replace('/')} />
            )}
        </div>
    );
};
