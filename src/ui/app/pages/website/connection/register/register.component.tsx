import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ReactProps, RegisterInfoDTO, RegisterRequestDTO } from 'cmap2-shared';
import ButtonInput from '../../../../shared/components/form/inputs/button.component';
import useCmapFetch from '../../../../shared/hooks/cmapFetch.hook';
import { ContentBox } from 'cmap2-shared/dist/react/';
import RegisterForm from './registerForm.component';
import FormControlBar from '../../../../shared/components/form/formControlBar.component';

interface RegisterProps extends ReactProps {
    setShowLogin: Dispatch<SetStateAction<boolean>>;
}

export default function Register({setShowLogin}: RegisterProps) {

    const cmapFetch = useCmapFetch();
    const [registrationInfo, setRegistrationInfo] = useState<RegisterInfoDTO | null>(null);

    useEffect(() => {
        window.electronAPI.get('getFingerprint').then(fingerprint => {
            cmapFetch<RegisterInfoDTO>('register', {
                method: 'POST',
                body: JSON.stringify({fingerprint} as RegisterRequestDTO),
                headers: {
                    'Content-Type': 'application/json'
                }
            }, data => {
                setRegistrationInfo(data);
            });
        });
    }, []);

    return (<ContentBox loading={registrationInfo == null}>
        <h2>Register</h2>
        {registrationInfo?.available ? (
            <RegisterForm registrationInfo={registrationInfo} setShowLogin={setShowLogin} />
        ) : (
            <div>
                Server is not currently accepting registrations
            </div>
        )}
        <FormControlBar>
            <ButtonInput onClick={() => setShowLogin(true)} text="Login" />
        </FormControlBar>
    </ContentBox>);

}
