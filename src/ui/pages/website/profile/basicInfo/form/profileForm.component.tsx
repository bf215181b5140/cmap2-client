import { BasicInfoFormDTO, BasicInfoFormSchema, ClientVisibilitySchema, KeyValueDTO, ProfilePageDTO } from 'cmap2-shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import useCmapFetch from '../../../../../hooks/cmapFetch.hook';
import FormTable from '../../../../../components/form/formTable.component';
import Input from '../../../../../components/input/input.component';
import FormControlBar from '../../../../../components/form/formControlBar.component';
import IconButton from '../../../../../components/buttons/iconButton.component';
import NotificationIcon from '../../../../../components/notifications/icon/notificationIcon.component';
import TextareaInput from '../../../../../components/input/textarea.component';
import Segment from '../../../../../components/segment/segment.component';
import SelectInput from '../../../../../components/input/select.component';

interface ProfileFormProps {
    profile: ProfilePageDTO;
    setBasicInfo: (basicInfo: BasicInfoFormDTO) => void;
}

export default function ProfileForm({ profile, setBasicInfo }: ProfileFormProps) {

    const { POST } = useCmapFetch();
    const { register, reset, formState: { errors, isDirty }, handleSubmit } = useForm<BasicInfoFormDTO>({
        defaultValues: profile,
        resolver: zodResolver(BasicInfoFormSchema)
    });
    const defaultLayoutOptions: KeyValueDTO[] = profile.layouts.map(l => ({ key: l.id, value: l.label }));

    const onSubmit = (formData: BasicInfoFormDTO) => {
        POST('profile/basicInfo', formData, undefined, () => {
            setBasicInfo(formData);
            reset(formData);
        });
    };

    return (<Segment segmentTitle={'Edit profile'} flexGrow={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormTable>
                <tr>
                    <th>Display name</th>
                    <td><Input register={register} name={'displayName'} errors={errors} /></td>
                </tr>
                <tr>
                    <th>
                        <NotificationIcon type={'info'} message={'Displayed on top of your website profile, leave empty to not show anything.'}>
                            Bio/message
                        </NotificationIcon>
                    </th>
                    <td><TextareaInput register={register} name={'bio'} errors={errors} width={'400px'} /></td>
                </tr>
                <tr>
                    <th>Profile visibility</th>
                    <td>
                        <SelectInput register={register} name={'visibility'} width={'auto'} errors={errors}
                                     options={ClientVisibilitySchema.options.map(value => ({ key: value, value: value }))} />
                    </td>
                </tr>
            </FormTable>
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
                        <th>Custom message</th>
                        <td><TextareaInput register={register} name={'unknownAvatarMessage'} errors={errors} width={'385px'} rows={2} /></td>
                    </tr>
                </FormTable>
            </fieldset>
            <fieldset>
                <legend>Offline</legend>
                <p>When you are offline a simple message is displayed that you are offline, or you can enter a custom message.</p>
                <FormTable>
                    <tr>
                        <th>Custom message</th>
                        <td colSpan={2}><TextareaInput register={register} name={'offlineMessage'} errors={errors} width={'385px'} rows={2} /></td>
                    </tr>
                </FormTable>
            </fieldset>
            <FormControlBar>
                <IconButton role={'save'} disabled={!isDirty} />
                <IconButton role={'reset'} disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </Segment>);
}
