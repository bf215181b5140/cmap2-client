import { useEffect, useState } from 'react';
import { theme, UpdateDTO, UpdatesDTO } from 'cmap2-shared';
import semver from 'semver';
import useCmapFetch from './cmapFetch.hook';

export default function useUpdateStatus() {

    const cmapFetch = useCmapFetch();
    const [currentVersion, setCurrentVersion] = useState<string>('');
    const [updates, setUpdates] = useState<UpdateDTO[]>([]);

    const newMajor = !!updates?.find(u => semver.major(u.version) > semver.major(currentVersion));
    const newMinor = !!updates?.find(u => semver.minor(u.version) > semver.minor(currentVersion));
    const newPatch = !!updates?.find(u => semver.patch(u.version) > semver.patch(currentVersion));

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        function fetchUpdates(version: string) {
            cmapFetch<UpdatesDTO>(`/updates?version=${version}`, {
                method: 'GET',
            }, (data) => {
                setUpdates(data.updates);
            });
        }

        window.electronAPI.get('getAppVersion').then(version => {
            setCurrentVersion(version);
            fetchUpdates(version);
            interval = setInterval(() => fetchUpdates(version), 1800 * 1000)
        });

        return () => {
            if (interval) clearInterval(interval);
        }
    }, []);

    function updateStatus(): string {
        if (newMajor || newMinor) return 'Update required';
        if (newPatch) return 'Update available';
        return 'Up to date';
    }

    function updateDetail(): string | undefined {
        if (newMajor) return 'To use website features please update to the latest version, otherwise things will not work.';
        if (newMinor) return 'To use website features please update to the latest version, otherwise some things will not work.';
        return undefined;
    }

    function updateStatusColor(): string | undefined {
        if (newMajor || newMinor) return theme.colors.error;
        if (newPatch) return theme.colors.warning;
        return undefined;
    }

    return {
        updateStatus: updateStatus(),
        updateDetail: updateDetail(),
        updateStatusColor: updateStatusColor(),
        currentVersion,
        updates,
    };
}
