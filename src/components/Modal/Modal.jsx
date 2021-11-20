import React from 'react';
import { createPortal } from 'react-dom';
import './Modal.scss';

export const Modal = ({ close, children }) => {
    return createPortal(
        <>
            <div className="modal-background" onClick={close}></div>
            <div className="modal-content">{children}</div>
        </>,
        document.getElementById('modal')
    );
};
