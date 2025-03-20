import { createContext } from 'react';
import { useToast } from '../../hooks/toast.hook';

export const ToastContext = createContext<ReturnType<typeof useToast>>({
  toasts: [],
  toastsDispatch() {
  }
});
