import StatusTable from '../components/statusTable.component';
import useVrcDetector from '../../../../hooks/vrcDetector.hook';

export default function VrcStatus() {

  const { vrcStatusColor, vrcStatus, icon } = useVrcDetector();

  return(<StatusTable>
    <thead>
    <tr>
      <th><h2>VRChat</h2></th>
      <td style={{ color: vrcStatusColor }}>
        {vrcStatus}
        <i className={icon} style={{ paddingLeft: '5px', fontSize: '20px' }} />
      </td>
    </tr>
    </thead>
    <tbody></tbody>
  </StatusTable>)
}