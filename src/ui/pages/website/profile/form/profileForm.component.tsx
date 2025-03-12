import { ClientVisibilitySchema, KeyValueDTO, ProfileFormDTO, ProfileFormSchema, ProfilePageDTO } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import useCmapFetch from '../../../../hooks/cmapFetch.hook';
import FormTable from '../../../../components/form/formTable.component';
import Input from '../../../../components/input/input.component';
import FormControlBar from '../../../../components/form/formControlBar.component';
import IconButton from '../../../../components/buttons/iconButton.component';
import NotificationIcon from '../../../../components/notifications/icon/notificationIcon.component';
import TextareaInput from '../../../../components/input/textarea.component';
import Segment from '../../../../components/segment/segment.component';
import SelectInput from '../../../../components/input/select.component';
import FormControlRow from '../../../../components/form/formControlRow.component';

interface ProfileFormProps {
  profile: ProfilePageDTO;
  saveProfileForm: (formData: ProfileFormDTO) => void;
}

export default function ProfileForm({ profile, saveProfileForm }: ProfileFormProps) {

  const { POST } = useCmapFetch();
  const { register, reset, formState: { errors, isDirty }, handleSubmit } = useForm<ProfileFormDTO>({
    defaultValues: profile,
    resolver: zodResolver(ProfileFormSchema)
  });
  const defaultLayoutOptions: KeyValueDTO[] = [{ key: '', value: '- None -' }, ...profile.layouts.map(l => ({ key: l.id, value: l.label }))];

  const onSubmit = (formData: ProfileFormDTO) => {
    POST('profile', formData, undefined, () => {
      saveProfileForm(formData);
      reset(formData);
    });
  };

  return (<Segment segmentTitle={'Edit profile'} width={'Half'}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable visible={true}>
        <tr>
          <th style={{ width: '120px' }}>Display name</th>
          <td><Input register={register} name={'displayName'} errors={errors} /></td>
        </tr>
        <tr>
          <th>
            <NotificationIcon type={'Info'} message={'Displayed on top of your website profile, leave empty to not show anything.'}>
              Bio/message
            </NotificationIcon>
          </th>
          <td><TextareaInput register={register} name={'bio'} errors={errors} /></td>
        </tr>
        <tr>
          <th>Profile visibility</th>
          <td>
            <SelectInput register={register} name={'visibility'} width={'auto'} errors={errors}
                         options={ClientVisibilitySchema.options.map(value => ({ key: value, value: value }))} />
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <fieldset>
              <legend>Unknown avatar</legend>
              <p>When using an avatar that isn't set on any layout you can display a specific default layout.</p>
              <p>If no default layout is selected then a simple message is displayed that you are using unsupported avatar, or you can enter a custom message.</p>
              <FormTable>
                <tr>
                  <th>Default layout</th>
                  <td><SelectInput register={register} name={'defaultLayoutId'} width={defaultLayoutOptions.length === 0 ? '150px' : 'auto'} errors={errors}
                                   readOnly={defaultLayoutOptions.length === 0} options={defaultLayoutOptions} /></td>
                </tr>
                <tr>
                  <th style={{ width: '120px' }}>Custom message</th>
                  <td><TextareaInput register={register} name={'unknownAvatarMessage'} errors={errors} rows={2} /></td>
                </tr>
              </FormTable>
            </fieldset>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <fieldset>
              <legend>Offline</legend>
              <p>When you are offline a simple message is displayed that you are offline, or you can enter a custom message.</p>
              <FormTable>
                <tr>
                  <th style={{ width: '120px' }}>Custom message</th>
                  <td colSpan={2}><TextareaInput register={register} name={'offlineMessage'} errors={errors} rows={2} /></td>
                </tr>
              </FormTable>
            </fieldset>
          </td>
        </tr>
      <FormControlRow colSpan={2}>
        <IconButton role={'save'} disabled={!isDirty} />
        <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
      </FormControlRow>
      </FormTable>
    </form>
  </Segment>);
}

