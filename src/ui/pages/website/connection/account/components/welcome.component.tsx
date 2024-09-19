import { useContext } from 'react';
import { CredentialsContext } from '../../../../../components/context/credentials.context';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../components/buttons/iconButton.component';

export default function Welcome() {

    const { credentials, clearLoginToken } = useContext(CredentialsContext);

    return (<>
        <h2>Welcome back, {credentials.displayName}!</h2>
        <FormControlBar>
            <IconButton role={'reset'} icon={'ri-shut-down-line'} tooltip={'Log out'} onClick={clearLoginToken} />
        </FormControlBar>
    </>);
}