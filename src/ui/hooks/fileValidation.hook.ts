import { useNotifications } from './useNotifications.hook';

interface FileValidationOptions {
  maxSize: number;
  allowedTypes: string[];
}

export default function useFileValidation() {

  const { addNotification } = useNotifications();

  function validateImage(file: File | undefined | null, onSuccess: () => void, onFail?: () => void) {
    validateFile(file, { maxSize: 3145728, allowedTypes: ['image/jpeg', 'image/png'] }, onSuccess, onFail);
  }

  function validateFile(file: File | undefined | null, { maxSize, allowedTypes }: FileValidationOptions, onSuccess: () => void, onFail?: () => void) {
    if (!file) return;

    let success: boolean = true;

    if (file.size >= maxSize) {
      addNotification('Error', 'File too large, max size is 3MB');
      success = false;
    } else if (!allowedTypes.includes(file.type)) {
      addNotification('Error', 'Only png or jpeg images');
      success = false;
    }

    if (success) {
      onSuccess();
    } else {
      if (onFail) onFail();
    }
  }

  return { validateImage, validateFile };
}
