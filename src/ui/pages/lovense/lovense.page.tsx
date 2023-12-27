import { Content, ContentBox } from 'cmap2-shared/dist/react';
import ActionButton from '../../shared/components/actionButton.component';
import { Toy } from 'lovense';
import { LovenseToy } from './components/toy.component';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { LovenseStatus } from '../../../shared/lovense/lovenseStatus';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import colors from 'cmap2-shared/src/colors.json';

export default function LovensePage() {

    const [lovenseStatus, setLovenseStatus] = useState<LovenseStatus>(new LovenseStatus());

    useEffect(() => {
        window.electronAPI.getLovenseStatus();

        window.electronAPI.lovenseStatus((event: Electron.IpcRendererEvent, lovenseStatus: LovenseStatus) => {
            setLovenseStatus(lovenseStatus);
        });
    }, []);

    function connect() {
        window.electronAPI.lovenseConnect();
    }

    function disconnect() {
        window.electronAPI.lovenseDisconnect();
    }

    function statusIcon(status: boolean) {
        if (status) {
            return <span style={{fontSize: '1.5em'}}><Icon icon="ri-check-fill" /></span>;
        } else {
            return <span style={{fontSize: '1.5em'}}><Icon icon="ri-close-fill" color="red" /></span>;
        }
    }

    return (<Content flexDirection="column">
        <ContentBox>
            <ConnectionFlexbox>
                <Connection>
                    <h2>Lovense connection</h2>
                    <p>Socket connection: {statusIcon(lovenseStatus.socketConnection)}</p>
                    <p>Connection to lovense: {statusIcon(!!lovenseStatus.status)}</p>
                    <p>Connection to device: {statusIcon(!!lovenseStatus.deviceInformation?.online)}</p>
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

            {lovenseStatus.deviceInformation?.toyList && <ToysStyled>
                {lovenseStatus.deviceInformation.toyList.map((toy: Toy) => (<LovenseToy toy={toy} key={toy.id} />))}
            </ToysStyled>}
        </ContentBox>
        <ContentBox title="Toy control">

        </ContentBox>
        <ContentBox title="Osc control">

        </ContentBox>
    </Content>);
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
    color: ${colors['text-4']};
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
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  margin: 15px 0;
`;
