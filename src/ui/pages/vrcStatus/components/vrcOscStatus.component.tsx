import { ContentBox } from 'cmap2-shared/dist/react';
import { useEffect, useState } from 'react';

export default function VrcOscStatus() {

    const [trackedAvatar, setTrackedAvatar] = useState<string | undefined>();
    const [trackedParameters, setTrackedParameters] = useState<Map<string, string | number | boolean>>(new Map());

    useEffect(() => {
        window.electronAPI.get('getTrackedAvatar').then(data => setTrackedAvatar(data));
        window.electronAPI.get('getTrackedParameters').then(data => setTrackedParameters(data));

        window.electronAPI.receive('vrcParameter', (data) => setTrackedParameters((state) => state.set(data.path, data.value)));
    }, []);

    function currentAvatarText() {
        if (trackedAvatar === undefined) return 'None';
        return trackedAvatar;
    }

    return (<ContentBox>
        <div>
            Current tracked avatar id: {currentAvatarText()}
        </div>

        {trackedParameters.size > 0 && (
            <table>
                <tr>
                    <th>Parameter path</th>
                    <th>Value</th>
                </tr>
                {Array.from(trackedParameters).map(parameter => (
                    <tr>
                        <td>{parameter[0]}</td>
                        <td>{parameter[1].toString()}</td>
                    </tr>
                ))}
            </table>
        )}
    </ContentBox>)
}
