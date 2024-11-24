import { useContext, useEffect, useRef } from 'react';
import { CredentialsContext } from '../../../../components/context/credentials.context';
import TextButton from '../../../../components/buttons/textButton.component';
import useSocketConnection from '../../../../hooks/socketConnection.hook';
import { useForm } from 'react-hook-form';
import { SocketSettings, SocketSettingsSchema } from '../../../../../shared/objects/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import Segment from '../../../../components/segment/segment.component';
import FormTable from '../../../../components/form/formTable.component';
import CheckboxInput from '../../../../components/input/checkbox.component';
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