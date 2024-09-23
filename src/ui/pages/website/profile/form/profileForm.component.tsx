import { ClientDTO, ClientVisibilityOptions, CmapSelectOption, OfflineDisplay, OfflineDisplayOptions, ProfileFormSchema, UnknownAvatarDisplayOptions } from 'cmap2-shared';
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
import { UnknownAvatarDisplay } from 'cmap2-shared/src/types/enums/client';

interface ProfileFormProps {
    client: ClientDTO;
    setProfileInfo: (client: ClientDTO) => void;
}

export default function ProfileForm({ client, setProfileInfo }: ProfileFormProps) {

    const { POST } = useCmapFetch();
    const { register, reset, formState: { errors, isDirty }, handleSubmit, watch } = useForm({
        defaultValues: client,
        resolver: zodResolver(ProfileFormSchema)
    });
    const defaultLayoutOptions: CmapSelectOption[] = client.layouts?.map(l => ({key: l.id, value: l.label })) || [];

    const onSubmit = (formData: any) => {
        POST('profile', formData, undefined, () => {
            setProfileInfo(formData);
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
                    <td><SelectInput register={register} name={'visibility'} width={'auto'} options={ClientVisibilityOptions} errors={errors} /></td>
                </tr>
                <tr>
                    <th>Default layout</th>
                    <td><SelectInput register={register} name={'defaultLayoutId'} width={defaultLayoutOptions.length === 0 ? '150px' : 'auto'}  errors={errors}
                                     readOnly={defaultLayoutOptions.length === 0}
                                     options={defaultLayoutOptions} /></td>
                </tr>
            </FormTable>
            <fieldset>
                <legend>Unknown avatar</legend>
                <p>What should be displayed on your profile when you're using an unknown avatar?</p>
                <FormTable>
                    <tr>
                        <th style={{width: '120px'}}>Show</th>
                        <td style={{width: '180px'}}>
                            <SelectInput register={register} name={'unknownAvatarDisplay'} width={'auto'} options={UnknownAvatarDisplayOptions} errors={errors} />
                        </td>
                        <td><p>{UnknownAvatarDisplayOptions.find(o => o.key === watch('unknownAvatarDisplay'))?.description}</p></td>
                    </tr>
                    <tr>
                        <th>Custom message</th>
                        <td colSpan={2}><TextareaInput register={register} name={'unknownAvatarMessage'} errors={errors} width={'385px'} rows={2}
                                           readOnly={watch('unknownAvatarDisplay') !== UnknownAvatarDisplay.CustomMessage} /></td>
                    </tr>
                </FormTable>
            </fieldset>
            <fieldset>
                <legend>Offline</legend>
                <p>What should be displayed on your profile when you're offline?</p>
                <FormTable>
                    <tr>
                        <th style={{width: '120px'}}>Show</th>
                        <td style={{width: '180px'}}>
                            <SelectInput register={register} name={'offlineDisplay'} width={'auto'} options={OfflineDisplayOptions} errors={errors} />
                        </td>
                        <td><p>{OfflineDisplayOptions.find(o => o.key === watch('offlineDisplay'))?.description}</p></td>
                    </tr>
                    <tr>
                        <th>Custom message</th>
                        <td colSpan={2}><TextareaInput register={register} name={'offlineMessage'} errors={errors} width={'385px'} rows={2}
                                           readOnly={watch('offlineDisplay') !== OfflineDisplay.CustomMessage} /></td>
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

