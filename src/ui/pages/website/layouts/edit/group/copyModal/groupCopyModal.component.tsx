import React, { useContext } from 'react';
import { ModalContext } from '../../../../../../components/context/modal.context';
import { getForcedItemLabel, GroupCopyDTO, GroupCopySchema, GroupDTO, GroupSchema, LayoutDTO } from 'cmap-shared';
import Icon from '../../../../../../components/icon/icon.component';
import TextButton from '../../../../../../components/buttons/textButton.component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import HiddenInput from '../../../../../../components/input/hidden.component';
import SelectInput from '../../../../../../components/input/select.component';
import FormTable from '../../../../../../components/form/formTable.component';
import useCmapFetch from '../../../../../../hooks/cmapFetch.hook';
import { useNotifications } from '../../../../../../hooks/useNotifications.hook';

interface GroupCopyModalProps {
  layouts: LayoutDTO[];
  group: GroupDTO;
  onSuccess: (layoutId: string, group: GroupDTO) => void;
}

export default function GroupCopyModal({ layouts, group, onSuccess }: GroupCopyModalProps) {

  const { clearModal } = useContext(ModalContext);
  const { POST } = useCmapFetch();
  const { addNotification } = useNotifications();
  const { register, formState: { errors }, handleSubmit } = useForm<GroupCopyDTO>({
    resolver: zodResolver(GroupCopySchema),
    defaultValues: { id: group.id, layoutId: '' }
  });

  function onSubmit(formData: GroupCopyDTO) {
    POST('layouts/group/copy', formData, GroupSchema, data => {
      addNotification('Success', 'Group copied.');
      onSuccess(formData.layoutId, data);
      clearModal();
    });
  }

  function onClose() {
    clearModal();
  }

  return (<>
      <div id="modalHeader">
        <h2>Copying group {getForcedItemLabel(group, 'group')}</h2>
        <span onClick={onClose}><Icon className={'ri-close-line'} /></span>
      </div>

      <p>Select where you'd like to create the copy and confirm.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <HiddenInput register={register} name={'id'} />
        <FormTable>
          <tr>
            <th style={{ width: '55px' }}>Layout</th>
            <td>
              <SelectInput options={layouts.map(l => ({ key: l.id, value: l.label }))} width={'100%'} register={register} name={'layoutId'} errors={errors} />
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