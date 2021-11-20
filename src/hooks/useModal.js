import { useState } from 'react';
import { disableScrolling, enableScrolling } from '../Utils/helpers';

export const useModal = () => {
    const [open, onOpenModal] = useState(false);
    const [close, onCloseModal] = useState(false);
    const [modalType, setType] = useState(undefined);

    const openModal = (type) => {
        type && setType(type);
        onOpenModal(true);
        window.scrollTo(0, 0);
        disableScrolling();
    };

    const closeModal = () => {
        setType(undefined);
        onCloseModal(true);
        onOpenModal(false);
        enableScrolling();
    };

    return { open, close, openModal, closeModal, modalType };
};
