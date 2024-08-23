import { useContext } from 'react';
import { ToastContext } from '../../components/mainWindow/mainWindow.componenet';
import { ToastType } from '../../components/toast/toast.hook';

export default function useFileValidation() {

    const toastsDispatch = useContext(ToastContext);

    function validateFile(file: File | undefined | null, type: 'image', onSuccess: () => void, onFail?: () => void) {
        if (!file) return;

        let success: boolean = true;

        switch (type) {
            case 'image':
                if (file.size >= 3145728) {
                    toastsDispatch({
                        type: 'add',
                        toast: { message: 'File too large, max size is 3MB', type: ToastType.ERROR }
                    });
                    success = false;
                } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
                    toastsDispatch({
                        type: 'add',
                        toast: { message: 'Only png or jpeg images', type: ToastType.ERROR }
                    });
                    success = false;
                }
                break;
        }

        if (success) {
            onSuccess();
        } else {
            if (onFail) onFail();
        }
    }

    return validateFile;
}
