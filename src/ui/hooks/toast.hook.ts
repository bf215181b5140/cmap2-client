import { useReducer } from 'react';
import { Toast } from '../components/toast.component';

type Action = {type: 'add', toast: Toast, dispatch: (action: Action) => void} | {type: 'remove', toast: Toast} | {type: 'clear'};

function toastReducer(state: Toast[], action: Action): Toast[] {
    switch (action.type) {
        case 'add':
            const newToast = action.toast;
            setTimeout(() => {
                action.dispatch({ type: "remove", toast: newToast });
            }, 8000);
            return [...state, action.toast];
        case 'remove':
            return state.filter((x: any) => x.id !== action.toast.id);
        case 'clear':
        default:
            return [];
    }
}

export default function useToast() {
    const [toasts, dispatch] = useReducer(toastReducer, []);

    const toastsDispatch = (action: Action) => {
        if (action.type === "add") {
            action.toast.id = (Math.random() + 1).toString(36).substring(7);
            action.dispatch = dispatch;
        }
        dispatch(action);
    };

    return {toasts, toastsDispatch};
}
