import { useReducer } from 'react';

function toastReducer(state: any, action: any) {
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
            return [];
        default:
            break;
    }
}

export default function useToast() {
    const [toasts, dispatch] = useReducer(toastReducer, []);

    const toastsDispatch = (action: any) => {
        if (action.type === "add") {
            action.toast.id = (Math.random() + 1).toString(36).substring(7);
            action.dispatch = dispatch;
        }
        dispatch(action);
    };

    return {toasts, toastsDispatch};
}
