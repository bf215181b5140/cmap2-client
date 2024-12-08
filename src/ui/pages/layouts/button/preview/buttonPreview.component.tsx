import TypedEmitter from 'typed-emitter/rxjs';
import { ButtonSectionEvents } from '../button.model';
import { useContext, useEffect, useState } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { ButtonDTO, UploadedFileDTO } from 'cmap2-shared';
import Segment from '../../../../components/segment/segment.component';
import ParameterButton from '../../../../components/preview/button/parameter.button';

interface ButtonPreviewProps {
  buttonSectionEvents: TypedEmitter<ButtonSectionEvents>;
}

export default function ButtonPreview({ buttonSectionEvents }: ButtonPreviewProps) {

  const { theme, button } = useContext(LayoutsPageContext);
  const [previewButton, setPreviewButton] = useState<ButtonDTO | undefined>(button);

  useEffect(() => {
    function onButtonFormChanged(formButton: ButtonDTO) {
      setPreviewButton(state => ({ ...formButton, image: state?.image }));
    }

    function onImageChanged(image: UploadedFileDTO | null) {
      setPreviewButton(state => {
        if (state) return { ...state, image };
        return state;
      });
    }

    buttonSectionEvents.on('onFormChange', onButtonFormChanged);
    buttonSectionEvents.on('onImageChange', onImageChanged);

    return () => {
      buttonSectionEvents.removeListener('onFormChange', onButtonFormChanged);
      buttonSectionEvents.removeListener('onImageChange', onImageChanged);
    };
  }, []);

  useEffect(() => {
    setPreviewButton(button);
  }, [button]);

  if (!previewButton) return;

  return (<Segment segmentTitle={'Preview'} width={'Full'}>
    <div style={{ maxWidth: '350px' }}>
      <ParameterButton button={previewButton} style={theme} />
    </div>
  </Segment>);
}
