import TypedEmitter from 'typed-emitter/rxjs';
import { useContext, useEffect, useState } from 'react';
import { PresetButtonDTO, UploadedFileDTO } from 'cmap-shared';
import { PresetButtonComponent } from 'cmap-shared/react';
import { EditPresetButtonEvents } from '../editPresetButton.model';
import { LayoutsPageContext } from '../../../layouts.context';
import Segment from '../../../../../../components/segment/segment.component';

interface PresetButtonPreviewProps {
  presetButtonEvents: TypedEmitter<EditPresetButtonEvents>;
  presetButton: PresetButtonDTO | undefined;
}

export default function PresetButtonPreview({ presetButtonEvents, presetButton }: PresetButtonPreviewProps) {

  const { theme } = useContext(LayoutsPageContext);
  const [previewPreset, setPreviewPreset] = useState<PresetButtonDTO | undefined>(presetButton);

  useEffect(() => {
    function onPresetFormChanged(formPreset: PresetButtonDTO) {
      setPreviewPreset(state => ({ ...formPreset, image: state?.image }));
    }

    function onImageChanged(image: UploadedFileDTO | null) {
      setPreviewPreset(state => {
        if (state) return { ...state, image };
        return state;
      });
    }

    presetButtonEvents.on('onFormChange', onPresetFormChanged);
    presetButtonEvents.on('onImageChange', onImageChanged);

    return () => {
      presetButtonEvents.removeListener('onFormChange', onPresetFormChanged);
      presetButtonEvents.removeListener('onImageChange', onImageChanged);
    };
  }, []);

  useEffect(() => {
    setPreviewPreset(presetButton);
  }, [presetButton, presetButton?.image]);

  if (!previewPreset) return;

  return (<Segment segmentTitle={'Preview'} width={'Full'}>
    <div style={{ maxWidth: '350px' }}>
      <PresetButtonComponent theme={theme} presetButton={previewPreset} />
    </div>
  </Segment>);
}
