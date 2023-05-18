import { useContext, useEffect, useState } from 'react';
import { InputType } from 'cmap2-shared';
import { ClientCredentialsContext } from '../../app/App';
import useConnectionIcon from '../../shared/hooks/connectionIcon.hook';
import styled from 'styled-components';
import FormInput from '../../shared/components/form/formInput.component';
import { SocketConnection, SocketConnectionType } from '../../../shared/SocketConnection';
import { ReactProps } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { FormTable } from '../../shared/components/form/formTable.component';
import { URL } from '../../../shared/const';
import ConnectForm from './connect.component';
import RegistrationForm from './register.component';
import ActionButton from '../../shared/components/actionButton.component';

interface ConnectionPageProps extends ReactProps {
    socketConnection: SocketConnection;
}

export default function ConnectionPage({socketConnection}: ConnectionPageProps) {

    const [connectForm, setConnectForm] = useState<boolean>(true);

    return (<HomePageStyled>
        {connectForm ? <ConnectForm socketConnection={socketConnection} setConnectForm={setConnectForm} />
            : <RegistrationForm socketConnection={socketConnection} setConnectForm={setConnectForm} />}
    </HomePageStyled>);
}

const HomePageStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
