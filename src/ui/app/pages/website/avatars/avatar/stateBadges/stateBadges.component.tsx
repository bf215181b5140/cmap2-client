import { AvatarDTO, FieldOption, ReactProps, StateBadgeDTO, StateBadgeKey, StateBadgesDTO, StateBadgesSchema, TierDTO } from 'cmap2-shared';
import React, { useEffect } from 'react';
import { AvatarReducerAction } from '../../avatars.reducer';
import useCmapFetch from '../../../../../shared/hooks/cmapFetch.hook';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { ContentBox } from 'cmap2-shared/dist/react';
import { ContentBoxWidth } from 'cmap2-shared/src';
import HiddenInput from '../../../../../shared/components/form/inputs/hidden.component';
import { FormTableStyled } from '../../../../../shared/components/form/formTable.component';
import Input from '../../../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../../../shared/components/form/inputs/select.component';
import ParameterInput from '../../../../../shared/components/form/inputs/parameterInput/parameterInput.component';
import DeleteButton from '../../../../../shared/components/buttons/deleteButton.component';
import FormControlBar from '../../../../../shared/components/form/formControlBar.component';
import ButtonInput from '../../../../../shared/components/form/inputs/button.component';
import SubmitInput from '../../../../../shared/components/form/inputs/submit.component';
import styled from 'styled-components';
import StateBadge from './components/stateBadge.component';

interface StateBadgesProps extends ReactProps {
    selectedAvatar: AvatarDTO;
    clientTier: TierDTO;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function StateBadges({ selectedAvatar, clientTier, avatarDataDispatch }: StateBadgesProps) {

    const customFetch = useCmapFetch();
    const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty }, setValue } = useForm<StateBadgesDTO>({
        defaultValues: {
            avatarId: selectedAvatar.id, badges: [...selectedAvatar.stateBadges || []]
        }, resolver: zodResolver(StateBadgesSchema)
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'badges' });
    const watchBadges = watch('badges')!;

    useEffect(() => {
        reset({ avatarId: selectedAvatar.id, badges: [...selectedAvatar.stateBadges || []] });
    }, [selectedAvatar, selectedAvatar.stateBadges]);

    function onSave(formData: StateBadgesDTO) {
        customFetch<StateBadgeDTO[]>('stateBadges', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
        }, data => {
            avatarDataDispatch({ type: 'saveStateBadges', stateBadges: data, avatarId: selectedAvatar.id! });
        });
    }

    function onDelete(index: number) {
        if (!watchBadges) return;
        const badge = watchBadges[index];
        if (badge.id) {
            customFetch('stateBadges', {
                method: 'DELETE',
                body: JSON.stringify(badge),
                headers: { 'Content-Type': 'application/json' }
            }, () => {
                avatarDataDispatch({ type: 'removeStateBadge', stateBadge: { ...badge, id: badge.id! }, avatarId: selectedAvatar.id! });
            });
        } else {
            remove(index);
        }
    }

    function stateBadgeKeyOption(): FieldOption[] {
        return Object.keys(StateBadgeKey)
            .map((key: string) => ({ key: StateBadgeKey[key as keyof typeof StateBadgeKey], value: StateBadgeKey[key as keyof typeof StateBadgeKey] }));
    }

    return (<ContentBox flexBasis={ContentBoxWidth.Full}>
        <h2>Avatar state badges</h2>
        <p>Avatar state badges are displayed under your username on your website profile. They are used to show various states such as if you're muted, afk,
            tracking type or anything else you set up with a Custom badge.</p>
        <p>Custom badges will be displayed if your current avatar parameters match exactly what you specify, otherwise they will not.</p>
        <p>For icons you can pick any from <b>https://remixicon.com/</b> and just copy their class value.
            For example the first icon called <b><i className={'ri-arrow-left-up-line'} />arrow-left-up-line</b> you would copy ri-arrow-left-up-line</p>
        {watchBadges && watchBadges.length > 0 && <>
            <h3>Preview</h3>
            <BadgeBox>
                {watchBadges?.map(badge => (<StateBadge badge={badge} key={Math.random().toString()} />))}
            </BadgeBox>
        </>}
        <form onSubmit={handleSubmit(onSave)}>
            <HiddenInput register={register} name={'avatarId'} />
            <FormTableStyled>
                <thead>
                {watchBadges && watchBadges.length > 0 &&
                    <tr>
                        <th>Badge type</th>
                        <th>Parameter</th>
                        <th>Value</th>
                        <th>Label</th>
                        <th>Icon</th>
                        <td></td>
                    </tr>
                }
                </thead>
                <tbody>
                {fields.map((item, index) => (
                    <tr key={index}>
                        <td>
                            <HiddenInput register={register} name={`badges.${index}.id`} />
                            <SelectInput register={register} name={`badges.${index}.key`} width="auto" errors={errors}
                                         options={stateBadgeKeyOption()} />
                        </td>
                        <td>
                            <ParameterInput register={register} name={`badges.${index}.parameter`} errors={errors} setValue={setValue}
                                            defaultType={'output'} defaultAvatarVrcId={selectedAvatar.id} />
                        </td>
                        <td>
                            <Input register={register} name={`badges.${index}.value`} width={'65px'} readOnly={watchBadges[index].key !== StateBadgeKey.Custom}
                                   errors={errors} />
                        </td>
                        <td>
                            <Input register={register} name={`badges.${index}.label`} width={'140px'} readOnly={watchBadges[index].key !== StateBadgeKey.Custom}
                                   errors={errors} />
                        </td>
                        <td>
                            <Input register={register} name={`badges.${index}.icon`} width={'160px'} readOnly={watchBadges[index].key !== StateBadgeKey.Custom}
                                   errors={errors} />
                        </td>
                        <td>
                            <DeleteButton onClick={() => onDelete(index)} keyword={'badge'} size={'small'} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <ButtonInput text="Add new" disabled={watchBadges.length >= Math.min(10, clientTier.stateBadges)} onClick={() => append({
                    id: null,
                    key: StateBadgeKey.Custom,
                    parameter: '',
                    value: '',
                    label: '',
                    icon: ''
                })} />
                <SubmitInput disabled={!isDirty} />
                <ButtonInput text="Reset" disabled={!isDirty} onClick={() => reset()} />
            </FormControlBar>
        </form>
    </ContentBox>);
}

const BadgeBox = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: start;
  background-color: ${props => props.theme.colors.ui.background4};
  border-radius: 8px;
  margin: 0 0 16px 0;
  padding: 2px 0;
  min-height: 24px;
`;
