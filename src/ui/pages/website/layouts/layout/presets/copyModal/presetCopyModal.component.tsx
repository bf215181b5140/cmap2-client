import React, { useContext } from 'react';
import { LayoutDTO, PresetButtonCopyDTO, PresetButtonCopySchema, PresetButtonDTO, PresetButtonSchema } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalContext } from '../../../../../../components/context/modal.context';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../../hooks/useNotifications.hook';
import Icon from '../../../../../../components/icon/icon.component';
import HiddenInput from '../../../../../../components/input/hidden.component';
import FormTable from '../../../../../../components/form/formTable.component';
import { SelectInputStyled } from '../../../../../../components/input/input.style';
import TextButton from '../../../../../../components/buttons/textButton.component';

interface ButtonCopyModalProps {
  layouts: LayoutDTO[];
  layout: LayoutDTO;
  preset: PresetButtonDTO;
  onSuccess: (layoutId: string, preset: PresetButtonDTO) => void;
}

export default function PresetCopyModal({ layouts, layout, preset, onSuccess }: ButtonCopyModalProps) {

  const { clearModal } = useContext(ModalContext);
  const { POST } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { setValue, register, formState: { errors }, handleSubmit } = useForm<PresetButtonCopyDTO>({
    resolver: zodResolver(PresetButtonCopySchema),
    defaultValues: { id: preset.id, layoutId: layout.id }
  });

  function onSubmit(formData: PresetButtonCopyDTO) {
    POST('layouts/preset/copy', formData, PresetButtonSchema, data => {
      addNotification('Success', 'Preset copied.');
      onSuccess(formData.layoutId, data);
      clearModal();
    });
  }

  function onClose() {
    clearModal();
  }

  return (<>
      <div id="modalHeader">
        <h2>Copying button {preset.label}</h2>
        <span onClick={onClose}><Icon className={'ri-close-line'} /></span>
      </div>

      <p>Select where you'd like to create the copy and confirm.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <HiddenInput register={register} name={'id'} />
        <FormTable>
          <tr>
            <th style={{ width: '55px' }}>Layout</th>
            <td>
              <SelectInputStyled width={'100%'} {...register('layoutId')} errors={!!errors.layoutId} >
                {layouts.map(l => (<option key={l.label} value={l.id}>{l.label}</option>))}
              </SelectInputStyled>
            </td>
          </tr>
        </FormTable>

        <div id="modalFooter">
          <TextButton text={'Create a copy'} type={'submit'} />
        </div>
      </form>
    </>
  );
}