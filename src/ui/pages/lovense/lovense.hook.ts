import { useEffect, useState } from 'react';
import { LovenseStatus, Toy } from 'lovense';

export default function useLovenseHook() {
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

    return {connected, toyList, qrCodeUrl, connect, disconnect};
}
