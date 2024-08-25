import { createContext } from 'react';
import useModalHook from '../modal/modal.hook';

export const ModalContext = createContext<ReturnType<typeof useModalHook>>({
    modal: null,
    setModal() {
    },
    clearModal() {
    },
    deleteModal() {
    }
});
