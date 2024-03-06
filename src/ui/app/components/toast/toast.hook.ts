import { useReducer } from 'react';

export enum ToastType {
    INFO,
    WARNING,
    ERROR,
    SUCCESS
}

export interface Toast {
    message: string;
    type: ToastType;
    id?: string;
    group?: string;
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
            return state.filter((x: any) => x.id !== action.toast.id);
        case 'clear':
        default:
            return [];
    }
}

export function useToast() {
    const [toasts, internalDispatch] = useReducer(toastReducer, []);

    // dispatch wrapper that sets a timeout on new toasts to clear them after 7 seconds
    const toastsDispatch = (action: ToastReducerAction) => {
        if (action.type === "add") {
            action.toast.id = (Math.random() + 1).toString(36).substring(7);
            // Set timeout to clear toast message
            action.toast.timeoutId = setTimeout(() => {
                internalDispatch({type: "remove", toast: action.toast});
            }, 7000);
        }
        internalDispatch(action);
    };

    return {toasts, toastsDispatch};
}
