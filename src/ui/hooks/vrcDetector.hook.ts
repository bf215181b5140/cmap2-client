import { useEffect, useState } from 'react';
import { theme } from 'cmap2-shared';

export default function useVrcDetector() {

    const [isVrcDetected, setIsVrcDetected] = useState<boolean | null>(null);

    useEffect(() => {
        window.IPC.send('checkIsVrcDetected');
        const removeListener = window.IPC.receive('isVrcDetected', (data) => setIsVrcDetected(data));

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    function vrcStatus() {
        if (isVrcDetected === null) return 'Not tracking if VRChat is running';

        if (isVrcDetected) {
            return 'VRChat is running';
        } else {
            return 'VRChat is not running';
        }
    }

    function vrcStatusColor(): string | undefined {
        if (isVrcDetected === null) return undefined;

        if (isVrcDetected) {
            return theme.colors.success;
        } else {
            return theme.colors.error;
        }
    }

    return { isVrcDetected, vrcStatus: vrcStatus(), vrcStatusColor: vrcStatusColor() };
}
