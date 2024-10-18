import Segment from '../../../../../components/segment/segment.component';
import { GroupDTO } from 'cmap2-shared';

interface GroupFormProps {
  editGroup: GroupDTO;
  title?: string;
}

export default function GroupForm({ editGroup, title }: GroupFormProps) {

  return (<Segment segmentTitle={title || 'Settings'}>

  </Segment>);
}