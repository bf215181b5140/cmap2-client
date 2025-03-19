import React, { useContext } from 'react';
import { getForcedItemLabel, LayoutDTO, PresetButtonCopyDTO, PresetButtonCopySchema, PresetButtonDTO, PresetButtonSchema } from 'cmap-shared';
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
import SelectInput from '../../../../../../components/input/select.component';

interface ButtonCopyModalProps {
  layouts: LayoutDTO[];
  layout: LayoutDTO;
  presetButton: PresetButtonDTO;
  onSuccess: (layoutId: string, preset: PresetButtonDTO) => void;
}

export default function PresetButtonCopyModal({ layouts, layout, presetButton, onSuccess }: ButtonCopyModalProps) {

  const { clearModal } = useContext(ModalContext);
  const { POST } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { register, formState: { errors }, handleSubmit } = useForm<PresetButtonCopyDTO>({
    resolver: zodResolver(PresetButtonCopySchema),
    defaultValues: { id: presetButton.id, layoutId: layout.id }
  });

  function onSubmit(formData: PresetButtonCopyDTO) {
    POST('layouts/presetButton/copy', formData, PresetButtonSchema, data => {
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
        <h2>Copying preset {getForcedItemLabel(presetButton, 'preset')}</h2>
        <span onClick={onClose}><Icon className={'ri-close-line'} /></span>
      </div>

      <p>Select where you'd like to create the copy and confirm.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <HiddenInput register={register} name={'id'} />
        <FormTable>
          <tr>
            <th style={{ width: '55px' }}>Layout</th>
            <td>
              <SelectInput options={layouts?.map(l => ({ key: l.id, value: l.label })) || []} width={'100%'} readOnly={layouts?.length === 0} register={register}
                           name={'layoutId'} errors={errors} />
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