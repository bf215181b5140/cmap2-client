import React, { useEffect, useState } from 'react';
import { RegisterInfoDTO, RegisterInfoSchema } from 'cmap2-shared';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import LoadingSpinner from '../../../../../../components/loadingSpinner/loadingSpinner.component';
import RegisterForm from './registerForm.component';
import SpanNotification from '../../../../../../components/spanNotification/spanNotification.component';

interface RegisterProps {
    loginSegment: () => void;
}

export default function Register({ loginSegment }: RegisterProps) {

    const { GET, fetchBusy } = useCmapFetch();
    const [registrationInfo, setRegistrationInfo] = useState<RegisterInfoDTO | undefined>();
    const [fingerprint, setFingerprint] = useState<string | undefined>();

    useEffect(() => {
        window.IPC.get('getFingerprint').then(data => setFingerprint(data));
        GET('register', RegisterInfoSchema, data => setRegistrationInfo(data));
    }, []);

    if (fetchBusy || !fingerprint) return <LoadingSpinner />;

    if (!registrationInfo) return undefined;

    if (!registrationInfo.available) {
        return (<>
            <SpanNotification type={'error'}>Website is currently not accepting new registrations.</SpanNotification>
            {registrationInfo.message && <SpanNotification type={'info'}>{registrationInfo.message}</SpanNotification>}
        </>);
    }

    return (<>
        {registrationInfo.keyRequired && <SpanNotification type={'warning'}>Registration is currently only available if you have an invite key.</SpanNotification>}
        {registrationInfo.message && <SpanNotification type={'info'}>{registrationInfo.message}</SpanNotification>}
        <RegisterForm registrationInfo={registrationInfo} fingerprint={fingerprint} loginSegment={loginSegment} />
    </>);
}
