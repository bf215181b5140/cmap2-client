import React from 'react';
import BasicModal from '../basicModal/basicModal.component';

export interface DeleteModalProps {
  keyword: string;
  confirmFunction: () => void;
  cancelFunction?: () => void;
}

export default function DeleteModal({ keyword, confirmFunction, cancelFunction }: DeleteModalProps) {

  return (<BasicModal title={`Delete ${keyword}`} message={`Are you sure you want to delete ${keyword}?`}
                      confirmValue={'Delete'} confirmFunction={confirmFunction} cancelFunction={cancelFunction} />);
}