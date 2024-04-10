import { useEffect, useState } from 'react';
import { theme } from 'cmap2-shared';
import { UpdateData } from '../../../../electron/update/update.model';

export default function useUpdateStatus() {

    const [updateData, setUpdateData] = useState<UpdateData | undefined>();

    useEffect(() => {
        const removeListener = window.electronAPI.receive('updateData', (data) => setUpdateData(data));

        window.electronAPI.send('checkForUpdate');

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    function updateStatus(): string {
        if (!updateData) return 'No update information';
        if (updateData.newMajor || updateData.newMinor) return 'Update required';
        if (updateData.newPatch) return 'Update recommended';
        return 'Up to date';
    }

    function updateDetail(): string | undefined {
        if (!updateData) return undefined;
        if (updateData.newMajor) return 'To use website features please update, otherwise things will not work.';
        if (updateData.newMinor) return 'To use website features please update, otherwise some things will not work.';
        if (updateData.newPatch) return 'New update has bug fixes and possibly new features.';
        return 'The application is up to date.';
    }

    function updateStatusColor(): string | undefined {
        if (!updateData) return undefined;
        if (updateData.newMajor || updateData.newMinor) return theme.colors.error;
        if (updateData.newPatch) return theme.colors.warning;
        return theme.colors.success;
    }

    return {
        updateStatus: updateStatus(),
        updateDetail: updateDetail(),
        updateStatusColor: updateStatusColor(),
        currentVersion: updateData?.currentVersion || '',
        lastCheck: updateData?.lastCheck,
        updates: updateData?.updates || [],
    };
}
