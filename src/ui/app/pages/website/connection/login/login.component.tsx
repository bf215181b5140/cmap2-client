import { Dispatch, SetStateAction, useContext } from 'react';
import { ReactProps } from 'cmap2-shared';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import LoginForm from './loginForm.component';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';
import { ClientCredentialsContext } from '../../../../contexts/contexts';
import ContentBox from '../../../../shared/components/contentBox/contentBox.component';

interface LoginProps extends ReactProps {
    setShowLogin: Dispatch<SetStateAction<boolean>>;
}

export default function Login({setShowLogin}: LoginProps) {

    const {clientCredentials, clearClientToken} = useContext(ClientCredentialsContext);

    function onLogOut() {
        clearClientToken();
    }

    return (<ContentBox>
        {!!clientCredentials.apiToken ? (<>
            <h2 style={{marginTop: '0'}}>Logged in as {clientCredentials.displayName}</h2>
            <ButtonInput onClick={() => onLogOut()} text={'Log out'} />
        </>) : (<>
            <h2 style={{marginTop: '0'}}>Log in</h2>
            <LoginForm />
            <FormControlBar>
                <ButtonInput onClick={() => setShowLogin(false)} text={'Register'} />
            </FormControlBar>
        </>)}
    </ContentBox>);

}
