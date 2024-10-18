import Segment from '../../../../../components/segment/segment.component';
import { ButtonDTO, ButtonFormDTO } from 'cmap2-shared';

interface ButtonPreviewProps {
  buttonPreview: ButtonFormDTO | undefined;
}

export default function ButtonPreview({ buttonPreview }: ButtonPreviewProps) {

  return(<Segment segmentTitle={'Preview'}>

  </Segment>)
}