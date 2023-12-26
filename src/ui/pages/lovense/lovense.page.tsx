import { Content, ContentBox } from 'cmap2-shared/dist/react';
import { useEffect, useState } from 'react';
import ActionButton from '../../shared/components/actionButton.component';
import { LovenseStatus, Toy, ToyCommand } from 'lovense';
import { LovenseToy } from './components/toy.component';

export function LovensePage() {

    const [connected, setConnected] = useState<boolean>(false);
    const [toyList, setToyList] = useState<Toy[]>([]);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    useEffect(() => {
        window.electronAPI.getLovenseStatus()
            .then((lovenseStatus: LovenseStatus) => {
                console.log('Recieved Lovense status: ', lovenseStatus);
                setConnected(lovenseStatus.connected);
                setQrCodeUrl(lovenseStatus.qrcodeUrl);
                setToyList(lovenseStatus.toyList);
            });

        window.electronAPI.lovenseQRUrl((event: any, message: string) => {
            console.log('Recieved Lovense QR URL: ', message);
            setQrCodeUrl(message);
        });

        window.electronAPI.lovenseStatus((event: any, lovenseStatus: LovenseStatus) => {
            console.log('Recieved Lovense status: ', lovenseStatus);
            setConnected(lovenseStatus.connected);
            setQrCodeUrl(lovenseStatus.qrcodeUrl);
            setToyList(lovenseStatus.toyList);
        });
    }, []);

    function connect() {
        window.electronAPI.lovenseConnect();
    }

    function disconnect() {
        window.electronAPI.lovenseDisconnect();
    }

    return (<Content>
        <ContentBox>
            <h1>{connected ? 'Connected' : 'Disconnected'}</h1>
            {qrCodeUrl ? <img src={qrCodeUrl} alt="lovenseQR" /> : null}

            {!connected && <ActionButton action={connect}>Connect</ActionButton>}
            {connected && <ActionButton action={disconnect}>Disconnect</ActionButton>}

            {toyList && toyList.map((toy: Toy) => (<LovenseToy toy={toy}/>))}
        </ContentBox>
    </Content>);
}

