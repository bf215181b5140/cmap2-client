import { useEffect, useState } from 'react';
import { theme } from 'cmap2-shared';
import { UpdateData } from '../../../../electron/updater/updater.model';

export default function useUpdateStatus() {

    const [updateData, setUpdateData] = useState<UpdateData>();

    useEffect(() => {
        const removeListener = window.electronAPI.receive('updateData', data => setUpdateData(data));

        window.electronAPI.send('checkForUpdates');

        return () => {
            if (removeListener) removeListener();
        }
    }, []);

    function updateStatus(): string {
        if (!updateData || !updateData.lastCheck) return 'Checking for updates...'
        if (updateData.newMajor || updateData.newMinor) return 'Update required';
        if (updateData.newPatch) return 'Update available';
        return 'Up to date';
    }

    function updateDetail(): string | undefined {
        if (!updateData || !updateData.lastCheck) return undefined;
        if (updateData.newMajor) return 'To use website features please update to the latest version, otherwise things will not work.';
        if (updateData.newMinor) return 'To use website features please update to the latest version, otherwise some things will not work.';
        return undefined;
    }

    function updateStatusColor(): string | undefined {
        if (!updateData || !updateData.lastCheck) return undefined;
        if (updateData.newMajor || updateData.newMinor) return theme.colors.error;
        if (updateData.newPatch) return theme.colors.warning;
        return undefined;
    }

    return {
        currentVersion: updateData?.currentVersion,
        updates: updateData?.updates || [],
        updateStatus: updateStatus(),
        updateDetail: updateDetail(),
        updateStatusColor: updateStatusColor()
    };
}
