import { Page } from '../../components/page/page.component';
import Segment from '../../components/segment/segment.component';
import SpanNotification from '../../components/spanNotification/spanNotification.component';
import React, { MouseEvent } from 'react';
import TextButton from '../../components/buttons/textButton.component';
import { useNotifications } from '../../hooks/useNotifications.hook';

export default function TestingPage() {

    const { addNotification } = useNotifications();

    function onClick(event: MouseEvent<HTMLDivElement>) {
        console.log(event.detail)
    }

    return (<Page flexDirection={'column'}>
        <Segment>
            <SpanNotification type={'info'}>Sed commodo nec quam sed dictum.</SpanNotification>
            <SpanNotification type={'success'}>Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</SpanNotification>
            <SpanNotification type={'warning'}>Nam ligula diam, dapibus id posuere nec, consectetur eu metus.</SpanNotification>
            <SpanNotification type={'error'}>Integer commodo risus id neque iaculis consequat.</SpanNotification>
            <TextButton text={'info'} onClick={() => addNotification('info', 'Sed.')} />
            <TextButton text={'success'} onClick={() => addNotification('success', 'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.')} />
            <TextButton text={'warning'} onClick={() => addNotification('warning', 'Nam ligula diam, dapibus id posuere nec, consectetur eu metus.')} />
            <TextButton text={'error'} onClick={() => addNotification('error', 'Integer commodo risus id neque iaculis consequat. Nam ligula diam, dapibus id posuere nec, consectetur eu metus. Nam ligula diam, dapibus id posuere nec, consectetur eu metus.')} />
            <div onClick={onClick}>Div with on click</div>
        </Segment>
    </Page>)
}