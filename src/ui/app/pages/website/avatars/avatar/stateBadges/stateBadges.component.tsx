import { AvatarDTO, FieldOption, ReactProps, StateBadgeDTO, StateBadgeKey, StateBadgesDTO, StateBadgesSchema, TierDTO } from 'cmap2-shared';
import React, { useEffect } from 'react';
import { AvatarReducerAction } from '../../avatars.reducer';
import useCmapFetch from '../../../../../shared/hooks/cmapFetch.hook';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { ContentBoxWidth } from 'cmap2-shared/src';
import HiddenInput from '../../../../../shared/components/form/inputs/hidden.component';
import { FormTableStyled } from '../../../../../shared/components/form/formTable.component';
import Input from '../../../../../shared/components/form/inputs/input.component';
import SelectInput from '../../../../../shared/components/form/inputs/select.component';
import ParameterInput from '../../../../../shared/components/form/inputs/parameterInput/parameterInput.component';
import FormControlBar from '../../../../../shared/components/form/formControlBar.component';
import styled from 'styled-components';
import StateBadge from './components/stateBadge.component';
import ContentBox from '../../../../../shared/components/contentBox/contentBox.component';
import copyIconClassExample from '../../../../../shared/images/stateBadges/stateBadges-copyIconClassExample.png';
import IconButton from '../../../../../shared/components/buttons/iconButton.component';
import ExternalLink from '../../../../../shared/components/externalLink/externalLink.component';
import NumberInput from '../../../../../shared/components/form/inputs/number.component';

interface StateBadgesProps extends ReactProps {
    selectedAvatar: AvatarDTO;
    clientTier: TierDTO;
    avatarDataDispatch: React.Dispatch<AvatarReducerAction>;
}

export default function StateBadges({ selectedAvatar, clientTier, avatarDataDispatch }: StateBadgesProps) {

    const customFetch = useCmapFetch();
    const { register, control, handleSubmit, watch, reset, formState: { errors, isDirty }, setValue } = useForm<StateBadgesDTO>({
        defaultValues: {
            avatarId: selectedAvatar.id, badges: [...selectedAvatar.stateBadges?.sort((a, b) => a.order - b.order) || []]
        }, resolver: zodResolver(StateBadgesSchema)
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'badges' });
    const watchBadges = watch('badges')!;

    useEffect(() => {
        reset({ avatarId: selectedAvatar.id, badges: [...selectedAvatar.stateBadges?.sort((a, b) => a.order - b.order) || []] });
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

    return (<ContentBox flexBasis={ContentBoxWidth.Full} infoContent={StateBadgesInfo()} contentTitle={'State badges'}>
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
                        <th>Order</th>
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
                            <ParameterInput register={register} name={`badges.${index}.parameter`} width={'230px'} errors={errors} setValue={setValue}
                                            defaultType={'output'} defaultAvatarVrcId={selectedAvatar.vrcId} />
                        </td>
                        <td>
                            <Input register={register} name={`badges.${index}.value`} width={'65px'} readOnly={watchBadges[index].key !== StateBadgeKey.Custom}
                                   errors={errors} />
                        </td>
                        <td>
                            <Input register={register} name={`badges.${index}.label`} width={'130px'} readOnly={watchBadges[index].key !== StateBadgeKey.Custom}
                                   errors={errors} />
                        </td>
                        <td>
                            <Input register={register} name={`badges.${index}.icon`} width={'160px'} readOnly={watchBadges[index].key !== StateBadgeKey.Custom}
                                   errors={errors} />
                        </td>
                        <td>
                            <NumberInput register={register} name={`badges.${index}.order`} width={'50px'} errors={errors} />
                        </td>
                        <td>
                            <IconButton style={'delete'} onClick={() => onDelete(index)} deleteKeyword={'badge'} size={'small'} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </FormTableStyled>
            <hr />
            <FormControlBar>
                <IconButton style={'add'} size={'small'} disabled={watchBadges.length >= Math.min(10, clientTier.stateBadges)} onClick={() => append({
                    id: null,
                    key: StateBadgeKey.Custom,
                    parameter: '',
                    value: '',
                    label: '',
                    icon: '',
                    order: watchBadges.reduce((max, b) => Math.max(max, b.order) + 1, 0)
                })} />
                <hr />
                <IconButton style={'save'} disabled={!isDirty} />
                <IconButton style={'reset'} disabled={!isDirty} onClick={() => reset()} />
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

function StateBadgesInfo() {
    return (<>
        <p>State badges are displayed under your username on your website profile. They are used to show various states such as if you're muted, afk,
            tracking type or anything else you set up with a Custom badge.</p>
        <p>Custom badges will be displayed if your current avatar parameters match exactly what you specify, otherwise they will not.</p>
        <p>For icons, you can pick any from <ExternalLink link={'https://remixicon.com/'}>https://remixicon.com/</ExternalLink> and just copy their class value.
            <br />
            <b>Example:</b> if you wanted the first icon listed, <b><i className={'ri-arrow-left-up-line'} />arrow-left-up</b>, you would click on it and
            copy <b>ri-arrow-left-up-line</b></p>
        <img alt={'Copy icon class example'} src={copyIconClassExample} style={{ textAlign: 'center', margin: '5px auto' }} />
    </>);
}
