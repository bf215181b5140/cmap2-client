import { useEffect, useState } from 'react';
import { ContentBox } from 'cmap2-shared/dist/react';
import { VrcParameter } from 'cmap2-shared';

interface VrcParameterWithKeyDate extends VrcParameter {
    key: string;
    date: Date;
}

export default function VrcOscHistory() {

    const [oscParameterHistory, setOscParameterHistory] = useState<VrcParameterWithKeyDate[]>([]);

    useEffect(() => {
        const removeListener = window.electronAPI.receive('vrcParameter', (data) => {
            setOscParameterHistory(state => [{...data, key: Date.now().toString(), date: new Date()}, ...state.slice(0, 50)]);
        });

        return () => {
            if (removeListener) removeListener();
        }
    }, []);

    return (<ContentBox>
        {oscParameterHistory.length > 0 && (
            <table>
                <thead>
                <tr>
                    <th>Time</th>
                    <th>Parameter</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {oscParameterHistory.map((parameter) => (
                    <tr key={parameter.key}>
                        <td>{parameter.date.toLocaleString()}</td>
                        <td>{parameter.path}</td>
                        <td>{parameter.value.toString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )}
    </ContentBox>)
}
