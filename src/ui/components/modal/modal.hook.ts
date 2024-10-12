import { useState } from 'react';

export interface Modal {
  title?: string;
  message?: string;
  confirmValue?: string;
  confirmFunction: () => void;
  cancelFunction?: () => void;
}

export default function useModalHook() {
  const [modal, setModal] = useState<Modal | null>(null);

  function clearModal() {
    setModal(null);
  }

  function deleteModal(keyword: string, confirmFunction: () => void) {
    setModal({
      title: `Delete ${keyword}`,
      message: `Are you sure you want to delete ${keyword}?`,
      confirmValue: 'Delete',
      confirmFunction: confirmFunction
    });
  }

  return { modal, setModal, clearModal, deleteModal };
}
