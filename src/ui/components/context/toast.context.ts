import { createContext } from 'react';
import { useToast } from '../toast/toast.hook';

export const ToastContext = createContext<ReturnType<typeof useToast>>({
    toasts: [],
    toastsDispatch() {
    }
});
