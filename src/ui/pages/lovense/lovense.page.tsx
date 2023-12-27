import { Content, ContentBox } from 'cmap2-shared/dist/react';
import ActionButton from '../../shared/components/actionButton.component';
import { Toy } from 'lovense';
import { LovenseToy } from './components/toy.component';
import useLovenseHook from './lovense.hook';

export default function LovensePage() {

    const {connected, toyList, qrCodeUrl, connect, disconnect} = useLovenseHook();

    return (<Content>
        <ContentBox>
            <h1>{connected ? 'Connected' : 'Disconnected'}</h1>
            {qrCodeUrl ? <img src={qrCodeUrl} alt="lovenseQR" /> : null}

            {!connected && <ActionButton action={connect}>Connect</ActionButton>}
            {connected && <ActionButton action={disconnect}>Disconnect</ActionButton>}

            {toyList && toyList.map((toy: Toy) => (<LovenseToy toy={toy} />))}
        </ContentBox>
    </Content>);
}

