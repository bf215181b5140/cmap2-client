import ActionButton from '../../shared/components/buttons/actionButton.component';
import { Toy } from 'lovense';
import { LovenseToy } from './components/toy.component';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { LovenseStatus } from '../../../../shared/lovense';
import ToyControl from './components/toyControl.component';
import OscControl from './components/oscControl.component';
import Settings from './components/lovenseSettings.component';
import Content from '../../shared/components/contentBox/content.component';
import ContentBox from '../../shared/components/contentBox/contentBox.component';
import { theme } from 'cmap2-shared';

export default function LovensePage() {

    const [lovenseStatus, setLovenseStatus] = useState<LovenseStatus>(new LovenseStatus());

    useEffect(() => {
        window.electronAPI.send('getLovenseStatus');

        const removeListener = window.electronAPI.receive('lovenseStatus', (lovenseStatus: LovenseStatus) => setLovenseStatus(lovenseStatus));

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    function connect() {
        window.electronAPI.send('lovenseConnect');
    }

    function disconnect() {
        window.electronAPI.send('lovenseDisconnect');
    }

    return (<Content flexDirection="column">
        <ContentBox>
            <ConnectionFlexbox>
                <Connection>
                    <h2 style={{ color: lovenseStatusColor(lovenseStatus), marginTop: 0 }}>{lovenseStatusMessage(lovenseStatus)}</h2>
                    {!lovenseStatus.socketConnection && <ActionButton action={connect}>Connect</ActionButton>}
                    {lovenseStatus.socketConnection && <ActionButton action={disconnect}>Disconnect</ActionButton>}
                </Connection>
                <QRCode>
                    {lovenseStatus.qrCodeData && <>
                        <QRCodeImageOverlay>
                            <img src={lovenseStatus.qrCodeData.qrcodeUrl} alt="lovenseQR" />
                            <p>Scan the QR code with the device your toys are connected to.</p>
                        </QRCodeImageOverlay>
                    </>}
                </QRCode>
            </ConnectionFlexbox>
        </ContentBox>
        {lovenseStatus.deviceInformation?.toyList &&
            <ContentBox toggleTitle="Toys">
                <ToysStyled>
                    {lovenseStatus.deviceInformation.toyList.map((toy: Toy) => (<LovenseToy toy={toy} key={toy.id} />))}
                </ToysStyled>
            </ContentBox>}
        <Settings />
        <ToyControl toyList={lovenseStatus.deviceInformation?.toyList} />
        <OscControl toyList={lovenseStatus.deviceInformation?.toyList} />
    </Content>);
}

function lovenseStatusMessage(lovenseStatus: LovenseStatus): string {
    if (lovenseStatus.socketConnection) {
        if (lovenseStatus.status === 1) {
            return 'Connected to lovense';
        }
        return 'Connecting to lovense...';
    }
    return 'Not connected to lovense';
}

function lovenseStatusColor(lovenseStatus: LovenseStatus): string {
    if (lovenseStatus.socketConnection) {
        if (lovenseStatus.status === 1) {
            return theme.colors.success;
        }
        return theme.colors.warning;
    }
    return theme.colors.error;
}

const ConnectionFlexbox = styled.div`
  display: flex;
  flex-flow: row;
  gap: 15px;
`;

const Connection = styled.div`
  flex-basis: 100%;
`;

const QRCode = styled.div`
  margin: 5px;

  img {
    display: block;
    border-radius: 8px;
    width: 250px;
    height: 250px;
  }
`;

const QRCodeImageOverlay = styled.div`
  position: relative;

  p {
    display: none;
    position: absolute;
    text-align: center;
    font-size: 16px;
    text-shadow: 0 0 5px black;
    color: ${props => props.theme.colors.font.textBright};
    top: 30%;
    bottom: 30%;
    left: 10%;
    right: 10%;
  }

  :hover > p {
    display: block;
  }

  :hover > img {
    transition: 0.1s linear;
    filter: opacity(0.15);
  }
`;

const ToysStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* ADJUSTMENT */
  grid-gap: 10px;
`;
