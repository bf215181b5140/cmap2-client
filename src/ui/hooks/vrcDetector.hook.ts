import { useEffect, useState } from 'react';
import { theme } from '../style/theme';

export default function useVrcDetector() {

  const [isVrcDetected, setIsVrcDetected] = useState<boolean | null>(null);
  const icon = 'ri-gamepad-line';

  useEffect(() => {
    window.IPC.send('vrcDetector:check');
    const removeListener = window.IPC.receive('vrcDetector:detection', (data) => setIsVrcDetected(data));

    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  function vrcStatus() {
    if (isVrcDetected === null) return 'Not checking if VRChat is running';

    if (isVrcDetected) {
      return 'Detected';
    } else {
      return 'Not detected';
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

  return { isVrcDetected, vrcStatus: vrcStatus(), vrcStatusColor: vrcStatusColor(), icon };
}
