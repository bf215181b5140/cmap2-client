import Segment from '../../../../../components/segment/segment.component';
import { ButtonDTO, ButtonFormDTO } from 'cmap2-shared';

interface ButtonFormProps {
  buttonPreview: ButtonFormDTO | undefined;
  editButton: ButtonDTO;
  title?: string;
}

export default function ButtonForm({ buttonPreview, editButton, title }: ButtonFormProps) {

  return(<Segment segmentTitle={title || 'Settings'}>

  </Segment>)
}