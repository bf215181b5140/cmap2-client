import { useReducer } from 'react';
import { Notification } from '../../shared/objects/notification';

export interface Toast extends Notification {
  timeoutId?: NodeJS.Timeout;
}

export type ToastReducerAction =
  { type: 'add', toast: Toast }
  | { type: 'remove', toast: Toast }
  | { type: 'clear' };

function toastReducer(state: Toast[], action: ToastReducerAction): Toast[] {
  switch (action.type) {
    case 'add':
      if (action.toast.group) {
        // If toast is part of a group, return filtered state with all other toasts in that group removed and clear their timeout
        return [...state.filter(toast => {
          if (toast.group !== action.toast.group) {
            return true;
          } else {
            clearTimeout(toast.timeoutId);
            return false;
          }
        }), action.toast];
      } else {
        // otherwise return state with new toast
        return [...state, action.toast];
      }
    case 'remove':
      return state.filter(toast => toast.id !== action.toast.id);
    case 'clear':
    default:
      return [];
  }
}

export function useToast() {
  const [toasts, internalDispatch] = useReducer(toastReducer, []);

  // dispatch wrapper that sets a timeout on new toasts to clear them after 7 seconds
  function toastsDispatch(action: ToastReducerAction) {
    if (action.type === 'add') {
      // Set timeout to clear toast message
      action.toast.timeoutId = setTimeout(() => {
        internalDispatch({ type: 'remove', toast: action.toast });
      }, 7000);
    }
    internalDispatch(action);
  }

  return { toasts, toastsDispatch };
}
