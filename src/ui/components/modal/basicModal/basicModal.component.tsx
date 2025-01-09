import React, { useContext } from 'react';
import { ModalContext } from '../../context/modal.context';
import Icon from '../../icon/icon.component';
import TextButton from '../../buttons/textButton.component';

export interface BasicModalProps {
  title?: string;
  message?: string;
  confirmValue?: string;
  confirmFunction: () => void;
  cancelFunction?: () => void;
}

export default function BasicModal({ title, message, confirmValue, confirmFunction, cancelFunction }: BasicModalProps) {

  const { clearModal } = useContext(ModalContext);

  function onConfirm() {
    confirmFunction();
    clearModal();
  }

  function onClose() {
    if (cancelFunction) cancelFunction();
    clearModal();
  }

  return (<>

    <div id="modalHeader">
      <h2>{title || 'Confirmation required'}</h2>
      <span onClick={onClose}><Icon className={'ri-close-line'} /></span>
    </div>

    <p>{message || 'Confirm your action'}</p>

    <div id="modalFooter">
      <TextButton text={confirmValue || 'Confirm'} onClick={onConfirm} />
    </div>

  </>);
}