import TypedEmitter from 'typed-emitter/rxjs';
import { EditParameterButtonEvents } from '../editParameterButton.model';
import { useContext, useEffect, useState } from 'react';
import { LayoutsPageContext } from '../../../layouts.context';
import { ParameterButtonDTO, UploadedFileDTO } from 'cmap-shared';
import Segment from '../../../../../../components/segment/segment.component';
import { LayoutButtonComponent } from 'cmap-shared/react';

interface ParameterButtonPreviewProps {
  parameterButtonEvents: TypedEmitter<EditParameterButtonEvents>;
  parameterButton: ParameterButtonDTO | undefined;
}

export default function ParameterButtonPreview({ parameterButtonEvents, parameterButton }: ParameterButtonPreviewProps) {

  const { theme } = useContext(LayoutsPageContext);
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

    parameterButtonEvents.on('onFormChange', onButtonFormChanged);
    parameterButtonEvents.on('onImageChange', onImageChanged);

    return () => {
      parameterButtonEvents.removeListener('onFormChange', onButtonFormChanged);
      parameterButtonEvents.removeListener('onImageChange', onImageChanged);
    };
  }, []);

  useEffect(() => {
    setPreviewButton(parameterButton);
  }, [parameterButton, parameterButton?.image]);

  if (!previewButton) return;

  return (<Segment segmentTitle={'Preview'} width={'Full'}>
    <div style={{ maxWidth: '350px' }}>
      <LayoutButtonComponent parameterButton={previewButton} theme={theme} />
    </div>
  </Segment>);
}
