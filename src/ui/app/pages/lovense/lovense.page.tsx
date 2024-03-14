import { Content, ContentBox } from 'cmap2-shared/dist/react';
import ActionButton from '../../shared/components/actionButton.component';
import { Toy } from 'lovense';
import { LovenseToy } from './components/toy.component';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { LovenseStatus } from '../../../../shared/lovense';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import ToyControl from './components/toyControl.component';
import OscControl from './components/oscControl.component';
import Settings from './components/lovenseSettings.component';

export default function LovensePage() {

    const [lovenseStatus, setLovenseStatus] = useState<LovenseStatus>(new LovenseStatus());

    useEffect(() => {
        window.electronAPI.send('getLovenseStatus');

        const removeListener = window.electronAPI.receive('lovenseStatus', (lovenseStatus: LovenseStatus) => setLovenseStatus(lovenseStatus));

        return () => {
            if (removeListener) removeListener();
        }
    }, []);

    function connect() {
        window.electronAPI.send('lovenseConnect');
    }

    function disconnect() {
        window.electronAPI.send('lovenseDisconnect');
    }

    function connectionMessage() {
        if (lovenseStatus.socketConnection) {
            if (lovenseStatus.status === 1) {
                return <p><Icon icon="ri-wifi-fill" /> Connected</p>;
            }
            return <p><Icon icon="ri-wifi-fill" color="orange" /> Connecting...</p>;
        }
        return <p><Icon icon="ri-wifi-off-fill" color="red" /> Not connected</p>;
    }

    return (<Content flexDirection="column">
        <ContentBox>
            <ConnectionFlexbox>
                <Connection>
                    <h2>Lovense connection</h2>
                    {connectionMessage()}
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
            <ContentBox title='Toys'>
                <ToysStyled>
                    {lovenseStatus.deviceInformation.toyList.map((toy: Toy) => (<LovenseToy toy={toy} key={toy.id} />))}
                </ToysStyled>
            </ContentBox>}
        <Settings />
        <ToyControl toyList={lovenseStatus.deviceInformation?.toyList} />
        <OscControl toyList={lovenseStatus.deviceInformation?.toyList} />
    </Content>);
}

const ConnectionFlexbox = styled.div`
  display: flex;
  flex-flow: row;
  gap: 15px;
`;

const Connection = styled.div`
  flex-basis: 100%;
  
  i {
    font-size: 20px;
  }
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
