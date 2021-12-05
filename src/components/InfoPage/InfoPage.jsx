import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useModal } from '../../hooks/useModal';
import { AssetSearch } from '../AssetSearch/AssetSearch';
import { Button } from '../Button/Button';
import { Modal } from '../Modal/Modal';
import './InfoPage.scss';

export const InfoPage = ({ title, message, icon }) => {
    const assetList = JSON.parse(localStorage.getItem('assetList'))?.list || [];
    const { open, openModal, closeModal } = useModal();

    return (
        <>
            {open && (
                <Modal close={closeModal}>
                    <AssetSearch searchOptions={assetList} close={closeModal} />
                </Modal>
            )}
            <div className="info-page">
                {icon && <FontAwesomeIcon icon={icon} size="10x" />}
                <h2>{title}</h2>
                <div className="info-page__message">{message}</div>
                {title.startsWith('Woops!') && <Button label="Search" onClick={openModal} />}
            </div>
        </>
    );
};
