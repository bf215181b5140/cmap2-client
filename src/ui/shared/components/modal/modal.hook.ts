import { useState } from 'react';

export interface Modal {
    title?: string;
    message?: string;
    confirmValue?: string;
    confirmFunction: () => void;
}

export interface ModalFunction {
    setModal: React.Dispatch<React.SetStateAction<Modal | null>>;
    clearModal: () => void;
    deleteModal: (keyword: string, confirmFunction: () => void) => void;
}

export default function ModalHook() {
    const [modal, setModal] = useState<Modal | null>(null);

    function clearModal() {
        setModal(null);
    }

    function deleteModal(keyword: string, confirmFunction: () => void) {
        setModal({
            title: `Delete ${keyword}`,
            message: `Are you sure you want to delete this ${keyword}?`,
            confirmValue: 'Delete',
            confirmFunction: confirmFunction
        });
    }

    return {modal, setModal, clearModal, deleteModal};
}
