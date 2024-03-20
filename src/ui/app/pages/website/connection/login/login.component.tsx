import { Dispatch, SetStateAction, useContext } from 'react';
import { ReactProps } from 'cmap2-shared';
import { ClientCredentialsContext } from '../../../../App';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import { ContentBox } from 'cmap2-shared/dist/react/';
import LoginForm from './loginForm.component';

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
            <h2>Logged in as {clientCredentials.displayName}</h2>
            <ButtonInput onClick={() => onLogOut()} text={'Log out'} />
        </>) : (<>
            <h2>Log in</h2>
            <LoginForm />
            <ButtonInput onClick={() => setShowLogin(false)} text={'Register'} />
        </>)}
    </ContentBox>);

}
