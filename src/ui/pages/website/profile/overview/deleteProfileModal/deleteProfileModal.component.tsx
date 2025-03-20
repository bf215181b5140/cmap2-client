import React, { useContext, useState } from 'react';
import { Credentials } from '../../../../../../shared/objects/credentials';
import { CredentialsContext } from '../../../../../components/context/credentials.context';
import { ModalContext } from '../../../../../components/context/modal.context';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../hooks/useNotifications.hook';
import Icon from '../../../../../components/icon/icon.component';
import TextButton from '../../../../../components/buttons/textButton.component';
import { InputStyled } from '../../../../../components/input/input.style';

export default function DeleteProfileModal() {

  const { clearModal } = useContext(ModalContext);
  const { setCredentials } = useContext(CredentialsContext);
  const { DELETE } = useCmapFetch();
  const { addNotification } = useNotifications();
  const [confirmationInput, setConfirmationInput] = useState<string>('');
  const phrase = 'delete my account';

  const correctInput = confirmationInput === phrase;

  function onDeleteProfile() {
    DELETE('profile', undefined, undefined, () => {
      clearModal();
      setCredentials(new Credentials());
      addNotification('Error', 'Your account has been deleted.');
    });
  }

  function onClose() {
    clearModal();
  }

  return (<>
      <div id="modalHeader">
        <h2>Deleting account</h2>
        <span onClick={onClose}><Icon className={'ri-close-line'} /></span>
      </div>

      <p>This action will delete your whole account, everything will be gone. Please type in the phrase "<b>{phrase}</b>" to confirm this action.</p>

      <InputStyled onChange={event => setConfirmationInput(event.target.value)} errors={!correctInput} />

      <div id="modalFooter">
        <TextButton text={'Delete'} type={'submit'} onClick={onDeleteProfile} disabled={!correctInput} />
      </div>
    </>
  );
}