import { useEffect, useState } from 'react';
import { ContentBox } from 'cmap2-shared/dist/react';
import { VrcParameter } from 'cmap2-shared';

export default function VrcOscHistory() {

    const [oscParameterHistory, setOscParameterHistory] = useState<VrcParameter[]>([]);

    useEffect(() => {
        window.electronAPI.receive('vrcParameter', (data) => setOscParameterHistory(state => [data, ...state]));
    }, []);

    return (<ContentBox>
        {oscParameterHistory.length > 0 && (
            <table>
                <tr>
                    <th>Parameter path</th>
                    <th>Value</th>
                </tr>
                {oscParameterHistory.map(parameter => (
                    <tr>
                        <td>{parameter.path}</td>
                        <td>{parameter.value.toString()}</td>
                    </tr>
                ))}
            </table>
        )}
    </ContentBox>)
}
