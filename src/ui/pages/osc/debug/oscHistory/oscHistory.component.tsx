import React, { useEffect, useState } from 'react';
import { VrcParameter } from 'cmap2-shared';
import Segment from '../../../../components/segment/segment.component';
import SegmentTable from '../../../../components/segment/segmentTable.component';

interface VrcParameterWithDate extends VrcParameter {
    date: Date;
}

export default function OscHistory() {

    const [oscParameterHistory, setOscParameterHistory] = useState<VrcParameterWithDate[]>([]);

    useEffect(() => {
        const removeListener = window.IPC.receive('vrcParameter', (data) => {
            setOscParameterHistory(state => [{ ...data, date: new Date() }, ...state.slice(0, 50)]);
        });

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    return (<Segment width={'Full'} segmentTitle={'OSC activity history'}>
        <SegmentTable>
            <thead>
            <tr>
                <th>Time</th>
                <th>Parameter</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {oscParameterHistory.length === 0 && <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>Waiting for OSC activity...</td>
            </tr>}
            {oscParameterHistory.map((parameter, index) => (
                <tr key={index}>
                    <td>{parameter.date.toLocaleTimeString() + '.' + ('000' + parameter.date.getMilliseconds()).slice(-3)}</td>
                    <td>{parameter.path}</td>
                    <td>{parameter.value.toString()}</td>
                </tr>
            ))}
            </tbody>
        </SegmentTable>
    </Segment>);
}
