import { ReactProps } from 'cmap2-shared';
import useCredentials from '../../hooks/clientCredentials.hook';
import { CredentialsContext } from './credentials.context';
import { ModalContext } from './modal.context';
import useModalHook from '../modal/modal.hook';
import { ToastContext } from './toast.context';
import { useToast } from '../toast/toast.hook';

export default function Context({ children }: ReactProps) {

    const credentialsHook = useCredentials();
    const toastHook = useToast();
    const modalHook = useModalHook();

    return (<>
        <CredentialsContext.Provider value={credentialsHook}>
            <ToastContext.Provider value={toastHook}>
                <ModalContext.Provider value={modalHook}>
                    {children}
                </ModalContext.Provider>
            </ToastContext.Provider>
        </CredentialsContext.Provider>
    </>);
}
