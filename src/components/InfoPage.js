import React from 'react';
import { useHistory } from 'react-router';
import Button from '../components/Button';
import '../css/InfoPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InfoPage = (props) => {
    const history = useHistory();
    const { title, message, icon } = props;

    return (
        <div className="info-page">
            <FontAwesomeIcon icon={icon} size="10x" />
            <h2>{title}</h2>
            <div className="info-page__message">{message}</div>
            {title.startsWith('Woops!') && (
                <Button label="Search" click={() => history.replace('/')} />
            )}
        </div>
    );
};

export default InfoPage;
