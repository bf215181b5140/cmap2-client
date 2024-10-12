import { ReactProps } from 'cmap2-shared';
import useCredentials from '../../hooks/credentials.hook';
import { CredentialsContext } from './credentials.context';
import { ModalContext } from './modal.context';
import useModalHook from '../modal/modal.hook';
import { ToastContext } from './toast.context';
import { useToast } from '../../hooks/toast.hook';
import { FetchStatusContext } from './fetchStatus.context';
import { useFetchStatus } from '../fetchStatus/fetchStatus.hook';

export default function Context({ children }: ReactProps) {

  const credentialsHook = useCredentials();
  const toastHook = useToast();
  const modalHook = useModalHook();
  const fetchStatusHook = useFetchStatus();

  return (<>
    <CredentialsContext.Provider value={credentialsHook}>
      <ToastContext.Provider value={toastHook}>
        <ModalContext.Provider value={modalHook}>
          <FetchStatusContext.Provider value={fetchStatusHook}>
            {children}
          </FetchStatusContext.Provider>
        </ModalContext.Provider>
      </ToastContext.Provider>
    </CredentialsContext.Provider>
  </>);
}
