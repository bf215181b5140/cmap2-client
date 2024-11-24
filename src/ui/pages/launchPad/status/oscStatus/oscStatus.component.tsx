import StatusTable from '../components/statusTable.component';
import useCmapUtil from '../../../../hooks/cmapUtil.hook';
import { useEffect, useState } from 'react';

export default function OscStatus() {

  const { timeSinceTimestamp } = useCmapUtil();
  const [lastOscActivity, setLastOscActivity] = useState<number | undefined>();
  const [key, setKey] = useState(0);

  useEffect(() => {
    function getLastOscActivity() {
      window.IPC.get('getLastOscActivity').then(data => {
        setLastOscActivity(data);
        // set key state to force a re-render for osc activity text if lastOscActivity number doesn't change
        setKey(state => state + 1);
      });
    }

    getLastOscActivity();
    const activityInterval = setInterval(getLastOscActivity, 1000);

    return () => {
      if (activityInterval) clearInterval(activityInterval);
    };
  }, []);

  return (<StatusTable>
    <thead>
    <tr>
      <th><h2>OSC</h2></th>
      <td></td>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>Last activity</td>
      <td key={key}>{timeSinceTimestamp(lastOscActivity, undefined, 'No OSC activity detected')}</td>
    </tr>
    </tbody>
  </StatusTable>);
}