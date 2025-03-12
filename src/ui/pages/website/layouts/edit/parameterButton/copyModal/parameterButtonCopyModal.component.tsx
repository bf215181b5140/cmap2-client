import React, { useContext, useState } from 'react';
import { ModalContext } from '../../../../../../components/context/modal.context';
import { ParameterButtonCopyDTO, ParameterButtonCopySchema, ParameterButtonDTO, ParameterButtonSchema, LayoutDTO, getForcedItemLabel } from 'cmap2-shared';
import Icon from '../../../../../../components/icon/icon.component';
import TextButton from '../../../../../../components/buttons/textButton.component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import HiddenInput from '../../../../../../components/input/hidden.component';
import SelectInput from '../../../../../../components/input/select.component';
import FormTable from '../../../../../../components/form/formTable.component';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../../hooks/useNotifications.hook';
import { SelectInputStyled } from '../../../../../../components/input/input.style';

interface ButtonCopyModalProps {
  layouts: LayoutDTO[];
  parameterButton: ParameterButtonDTO;
  onSuccess: (layoutId: string, groupId: string, parameterButton: ParameterButtonDTO) => void;
}

export default function ParameterButtonCopyModal({ layouts, parameterButton, onSuccess }: ButtonCopyModalProps) {

  const { clearModal } = useContext(ModalContext);
  const { POST } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { setValue, register, formState: { errors }, handleSubmit } = useForm<ParameterButtonCopyDTO>({
    resolver: zodResolver(ParameterButtonCopySchema),
    defaultValues: { id: parameterButton.id, groupId: '' }
  });
  const [layoutId, setLayoutId] = useState<string>('');
  const layout = layouts.find(l => l.id === layoutId);

  function onSubmit(formData: ParameterButtonCopyDTO) {
    POST('layouts/parameterButton/copy', formData, ParameterButtonSchema, data => {
      addNotification('Success', 'Button copied.');
      onSuccess(layoutId, formData.groupId, data);
      clearModal();
    });
  }

  function onClose() {
    clearModal();
  }

  return (<>
      <div id="modalHeader">
        <h2>Copying button {getForcedItemLabel(parameterButton, 'button')}</h2>
        <span onClick={onClose}><Icon className={'ri-close-line'} /></span>
      </div>

      <p>Select where you'd like to create the copy and confirm.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <HiddenInput register={register} name={'id'} />
        <FormTable>
          <tr>
            <th style={{ width: '55px' }}>Layout</th>
            <td>
              <SelectInputStyled width={'100%'} value={layoutId} onChange={(event) => {
                setLayoutId(event.target.value);
                setValue('groupId', '');
              }}>
                {layouts.map(l => (<option key={l.label} value={l.id}>{l.label}</option>))}
              </SelectInputStyled>
            </td>
          </tr>
          <tr>
            <th>Group</th>
            <td>
              <SelectInput options={layout?.groups?.map(g => ({ key: g.id, value: getForcedItemLabel(g, 'group') })) || []} width={'100%'} readOnly={!layout || layout.groups?.length === 0} register={register}
                           name={'groupId'} errors={errors} />
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