import { useReducer } from 'react';
import { Toast } from './toast.component';

export type ToastReducerAction =
    { type: 'add', toast: Toast, dispatch?: (action: ToastReducerAction) => void }
    | { type: 'remove', toast: Toast }
    | { type: 'clear' };

function toastReducer(state: Toast[], action: ToastReducerAction): Toast[] {
    switch (action.type) {
        case 'add':
            const newToast = action.toast;

            setTimeout(() => {
                if (action.dispatch) action.dispatch({type: "remove", toast: newToast});
            }, 8000);

            if (action.toast.group) {
                return [...state.filter(toast => toast.group !== action.toast.group), action.toast];
            }

            return [...state, action.toast];
        case 'remove':
            return state.filter((x: any) => x.id !== action.toast.id);
        case 'clear':
        default:
            return [];
    }
}

export function useToast() {
    const [toasts, dispatch] = useReducer(toastReducer, []);

    const toastsDispatch = (action: ToastReducerAction) => {
        if (action.type === "add") {
            action.toast.id = (Math.random() + 1).toString(36).substring(7);
            action.dispatch = dispatch;
        }
        dispatch(action);
    };

    return {toasts, toastsDispatch};
}
