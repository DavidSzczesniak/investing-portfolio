import React, { useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalContext } from '../ModalContext';
import './Modal.scss';

export const Modal = ({ children }) => {
    const { closeModal } = useContext(ModalContext);

    useEffect(() => {
        console.log('modal renders now');
    }, []);

    return createPortal(
        <>
            <div className="modal-background" onClick={closeModal}></div>
            <div className="modal-content">{children}</div>
        </>,
        document.getElementById('modal')
    );
};
