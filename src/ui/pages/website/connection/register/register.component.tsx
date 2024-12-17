import React, { useEffect, useState } from 'react';
import { RegisterInfoDTO, RegisterInfoSchema } from 'cmap2-shared';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import LoadingSpinner from '../../../../components/loadingSpinner/loadingSpinner.component';
import RegisterForm from './registerForm.component';
import SpanNotification from '../../../../components/spanNotification/spanNotification.component';
import NoConnection from '../../../../components/noConnection/noConnection.component';
import Segment from '../../../../components/segment/segment.component';

interface RegisterProps {
  toLogin: () => void;
}

export default function Register({ toLogin }: RegisterProps) {

  const { GET, fetchBusy } = useCmapFetch();
  const [registrationInfo, setRegistrationInfo] = useState<RegisterInfoDTO | undefined>();
  const [fingerprint, setFingerprint] = useState<string | undefined>();
  const [noConnection, setNoConnection] = useState<boolean>(false);

  useEffect(() => {
    window.IPC.get('utility:fingerprint').then(data => setFingerprint(data));
    GET('register', RegisterInfoSchema, data => setRegistrationInfo(data), () => setNoConnection(true));
  }, []);

  if (noConnection) return <NoConnection />;

  if (fetchBusy || !fingerprint) return <LoadingSpinner />;

  if (!registrationInfo) return undefined;

  if (!registrationInfo.available) {
    return (<>
      <SpanNotification type={'Error'}>Website is currently not accepting new registrations.</SpanNotification>
      {registrationInfo.message && <SpanNotification type={'Info'}>{registrationInfo.message}</SpanNotification>}
    </>);
  }

  return (<Segment segmentTitle={'Register'}>
    {registrationInfo.keyRequired && <SpanNotification type={'Warning'}>Registration is currently only available if you have an invite key.</SpanNotification>}
    {registrationInfo.message && <SpanNotification type={'Info'}>{registrationInfo.message}</SpanNotification>}
    <RegisterForm registrationInfo={registrationInfo} fingerprint={fingerprint} toLogin={toLogin} />
  </Segment>);
}
