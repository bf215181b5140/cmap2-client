import { useEffect, useState } from 'react';
import { theme } from 'cmap2-shared';
import { UpdateData } from '../../../../electron/updater/updater.model';
import semver from 'semver';

export default function useUpdateStatus() {

    const [updateData, setUpdateData] = useState<UpdateData>();

    const newUpdate = !!updateData?.latest?.version && semver.lt(updateData?.currentVersion, updateData?.latest?.version);
    const newMajor = !!updateData?.latest?.version && semver.major(updateData?.latest?.version) > semver.major(updateData?.currentVersion);
    const newMinor = !!updateData?.latest?.version && semver.minor(updateData?.latest?.version) > semver.minor(updateData?.currentVersion);
    const newPatch = !!updateData?.latest?.version && semver.patch(updateData?.latest?.version) > semver.patch(updateData?.currentVersion);

    useEffect(() => {
        const removeListener = window.electronAPI.receive('updateData', data => setUpdateData(data));

        window.electronAPI.send('checkForUpdates');

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    function updateStatus(): string {
        if (!updateData || !updateData.lastCheck) return 'Checking for updates...';
        if (newUpdate) {
            if (newMajor || newMinor) return 'Update required';
            if (newPatch) return 'Update available';
        }
        return 'Up to date';
    }

    function updateDetail(): string | undefined {
        if (!updateData || !updateData.lastCheck) return undefined;
        if (newUpdate) {
            if (newMajor) return 'To use website features please update to the latest version, otherwise things will not work.';
            if (newMinor) return 'To use website features please update to the latest version, otherwise some things will not work.';
        }
        return undefined;
    }

    function updateStatusColor(): string | undefined {
        if (!updateData || !updateData.lastCheck) return undefined;
        if (newUpdate) {
            if (newMajor || newMinor) return theme.colors.error;
            if (newPatch) return theme.colors.warning;
        }
        return undefined;
    }

    return {
        currentVersion: updateData?.currentVersion,
        latest: newUpdate ? updateData?.latest : undefined,
        updateStatus: updateStatus(),
        updateDetail: updateDetail(),
        updateStatusColor: updateStatusColor()
    };
}
