import { useContext } from 'react';
import { CredentialsContext } from '../../../../components/context/credentials.context';
import TextButton from '../../../../components/buttons/textButton.component';
import FormControlBar from '../../../../components/form/formControlBar.component';

export default function Account() {

  const { credentials, clearLoginToken } = useContext(CredentialsContext);

  return (<>
    <h2>Logged in as {credentials.displayName}</h2>
    <FormControlBar>
      <TextButton text={'Log out'} onClick={clearLoginToken} />
    </FormControlBar>
  </>);

}