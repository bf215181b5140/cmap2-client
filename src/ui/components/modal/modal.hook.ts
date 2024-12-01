import { ReactNode, useState } from 'react';

export default function useModalHook() {
  const [modal, setModal] = useState<ReactNode | undefined>();

  function clearModal() {
    setModal(undefined);
  }

  return { modal, setModal, clearModal };
}
