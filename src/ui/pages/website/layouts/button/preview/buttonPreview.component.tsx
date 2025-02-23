import TypedEmitter from 'typed-emitter/rxjs';
import { ButtonSectionEvents } from '../button.model';
import { useContext, useEffect, useState } from 'react';
import { LayoutsPageContext } from '../../layouts.context';
import { ParameterButtonDTO, UploadedFileDTO } from 'cmap2-shared';
import Segment from '../../../../../components/segment/segment.component';
import { LayoutButtonComponent } from 'cmap2-shared/react';

interface ButtonPreviewProps {
  buttonSectionEvents: TypedEmitter<ButtonSectionEvents>;
}

export default function ButtonPreview({ buttonSectionEvents }: ButtonPreviewProps) {

  const { theme, parameterButton } = useContext(LayoutsPageContext);
  const [previewButton, setPreviewButton] = useState<ParameterButtonDTO | undefined>(parameterButton);

  useEffect(() => {
    function onButtonFormChanged(formButton: ParameterButtonDTO) {
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
    setPreviewButton(parameterButton);
  }, [parameterButton]);

  if (!previewButton) return;

  return (<Segment segmentTitle={'Preview'} width={'Full'}>
    <div style={{ maxWidth: '350px' }}>
      <LayoutButtonComponent parameterButton={previewButton} theme={theme} />
    </div>
  </Segment>);
}
