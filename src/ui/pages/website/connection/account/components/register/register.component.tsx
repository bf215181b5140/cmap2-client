import React, { useEffect, useState } from 'react';
import { RegisterInfoDTO, RegisterInfoSchema } from 'cmap2-shared';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import RegisterForm from './registerForm.component';
import LoadingSpinner from '../../../../../../components/loadingSpinner/loadingSpinner.component';

export default function Register() {

    const { POST } = useCmapFetch();
    const [registrationInfo, setRegistrationInfo] = useState<RegisterInfoDTO | undefined>();

    useEffect(() => {
        // window.IPC.get('getFingerprint').then(fingerprint => {
        //     POST('register', fingerprint, RegisterInfoSchema, data => {
        //         setRegistrationInfo(data);
        //     });
        // });
    }, []);

    if (!registrationInfo) return <LoadingSpinner />;

    return (<>
        {registrationInfo.available ? (<>
            {/* <RegisterForm registrationInfo={registrationInfo} /> */}
        </>) : (
            <div>
                Server is not currently accepting registrations
            </div>
        )}
    </>);
}
