import { useEffect, useState } from 'react';
import { theme } from '../style/theme';

export default function useSocketConnection() {

  const [connected, setConnected] = useState<boolean>(false);
  const message = connected ? 'Connected' : 'Not Connected';
  const color = connected ? theme.colors.success : theme.colors.error;
  const icon = 'ri-global-line';

  useEffect(() => {
    window.IPC.get('getSocketConnected').then(data => setConnected(data));

    const removeListener = window.IPC.receive('socketConnected', (data) => setConnected(data));

    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  return { connected, message, color, icon };
}
