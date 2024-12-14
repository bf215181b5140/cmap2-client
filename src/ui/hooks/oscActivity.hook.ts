import { useEffect, useState } from 'react';
import { theme } from '../style/theme';
import useCmapUtil from './cmapUtil.hook';

export default function useOscActivity() {

  const { timeSinceTimestamp } = useCmapUtil();
  const [lastOscActivity, setLastOscActivity] = useState<number | undefined>();

  // set state to force a re-render for osc activity text if lastOscActivity number doesn't change
  const [lastOscActivityUpdate, setLastOscActivityUpdate] = useState(Date.now());

  const oscActivityText = timeSinceTimestamp(lastOscActivity, 'Last OSC activity: ', 'No OSC activity detected');

  useEffect(() => {
    function getLastOscActivity() {
      window.IPC.get('getLastOscActivity').then(data => {
        setLastOscActivity(data);
        setLastOscActivityUpdate(Date.now());
      });
    }

    getLastOscActivity();
    const activityInterval = setInterval(getLastOscActivity, 1000);

    return () => {
      if (activityInterval) clearInterval(activityInterval);
    };
  }, []);

  function oscActivityColor(): string {
    if (!lastOscActivity) return theme.colors.error;

    const now = Date.now();
    if (lastOscActivity > now - 60000) {
      return theme.colors.success;
    } else if (lastOscActivity > now - 600000) {
      return theme.colors.attention;
    } else {
      return theme.colors.error;
    }
  }

  return { lastOscActivity, oscActivityText, oscActivityColor: oscActivityColor(), lastOscActivityUpdate };
}
