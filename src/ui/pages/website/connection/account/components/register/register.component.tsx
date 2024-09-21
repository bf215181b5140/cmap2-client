import React, { useEffect, useState } from 'react';
import { RegisterInfoDTO, RegisterInfoSchema } from 'cmap2-shared';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import LoadingSpinner from '../../../../../../components/loadingSpinner/loadingSpinner.component';
import RegisterForm from './registerForm.component';
import SpanNotification from '../../../../../../components/spanNotification/spanNotification.component';

export default function Register() {

    const { GET } = useCmapFetch();
    const [registrationInfo, setRegistrationInfo] = useState<RegisterInfoDTO | undefined>();
    const [fingerprint, setFingerprint] = useState<string | undefined>();

    useEffect(() => {
        window.IPC.get('getFingerprint').then(data => setFingerprint(data));
        GET('register', RegisterInfoSchema, data => setRegistrationInfo(data));
    }, []);

    if (!registrationInfo || !fingerprint) return <LoadingSpinner />;

    return (<>
        {!registrationInfo.available && <SpanNotification type={'error'}>Registrations are currently not available.</SpanNotification>}
        {registrationInfo.keyRequired && <SpanNotification type={'warning'}>Currently it's required to use a registration key when creating a new account.</SpanNotification>}
        {registrationInfo.message && <SpanNotification type={'info'}>{registrationInfo.message}</SpanNotification>}
        {registrationInfo.available && <RegisterForm registrationInfo={registrationInfo} fingerprint={fingerprint} />}
    </>);
}
