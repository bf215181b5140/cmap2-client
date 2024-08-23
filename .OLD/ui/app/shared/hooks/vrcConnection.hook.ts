import { useEffect, useState } from 'react';
import { theme } from 'cmap2-shared';

export default function useVrcConnection() {

    const [isVrcRunning, setIsVrchatRunning] = useState<boolean | null>(null);

    useEffect(() => {
        window.electronAPI.send('getIsVrchatRunning');
        const removeListener = window.electronAPI.receive('isVrchatRunning', (data) => setIsVrchatRunning(data));

        return () => {
            if (removeListener) removeListener();
        }
    }, []);

    function vrcStatus() {
        if (isVrcRunning === null) return 'Not tracking if VRChat is running';

        if (isVrcRunning) {
            return 'VRChat is running';
        } else {
            return 'VRChat is not running';
        }
    }

    function vrcStatusColor(): string | undefined {
        if (isVrcRunning === null) return undefined;

        if (isVrcRunning) {
            return theme.colors.success;
        } else {
            return theme.colors.error
        }
    }

    return {isVrcRunning, vrcStatus: vrcStatus(), vrcStatusColor: vrcStatusColor()};
}
