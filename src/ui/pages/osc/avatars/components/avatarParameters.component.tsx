import styled from 'styled-components';
import React, { useState } from 'react';
import AvatarParameter from './avatarParameter.component';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { VrcOscAvatarParameter } from '../../../../../shared/objects/vrcOscAvatar';
import { globalInputStyle, SelectInputStyled } from '../../../../style/input.style';
import Icon from '../../../../components/icon/icon.component';

interface AvatarParametersProps {
    avatarId: string;
    parameters: VrcOscAvatarParameter[];
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

const sortOrder = [
    { key: 'none', value: 'None' },
    { key: 'asc', value: 'Ascending' },
    { key: 'desc', value: 'Descending' }
];

export default function AvatarParameters({ avatarId, parameters, avatarsDispatch }: AvatarParametersProps) {

    const [filter, setFilter] = useState<string>('');
    const [sort, setSort] = useState<string>('none');
    const [showProperties, setShowProperties] = useState<boolean>(true);
    const [parent] = useAutoAnimate();

    function filteredParameters(): VrcOscAvatarParameter[] {
        let filteredList;

        if (filter) {
            filteredList = parameters.filter(parameter => parameter.name.toLowerCase().includes(filter.toLowerCase()));
        } else {
            filteredList = parameters;
        }

        if (sort === 'asc') {
            filteredList = [...filteredList].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'desc') {
            filteredList = [...filteredList].sort((a, b) => b.name.localeCompare(a.name));
        }

        return filteredList;
    }

    return (<div>

        <FiltersStyled>
            <div>
                <FilterInputStyled placeholder={'Search by name'} onChange={(event) => setFilter(event.target.value)} />
                Sort
                <SelectInputStyled errors={false} width={'125px'} onChange={(event) => setSort(event.target.value)}>
                    {sortOrder.map(option => (<option value={option.key} key={option.key}>{option.value}</option>))}
                </SelectInputStyled>
            </div>

            <div>
                Show parameter info
                <CollapseCheckboxStyled onClick={() => setShowProperties((state) => !state)} checked={showProperties}>
                    <Icon icon="ri-check-fill" />
                </CollapseCheckboxStyled>
            </div>
        </FiltersStyled>

        <AvatarParametersStyled ref={parent}>
            {filteredParameters().map(parameter => (<AvatarParameter avatarId={avatarId} parameter={parameter} avatarsDispatch={avatarsDispatch}
                                                                     forceShowProperties={showProperties} key={parameter.name} />))}
        </AvatarParametersStyled>
    </div>);
}

const FiltersStyled = styled.div`
    margin: 8px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const AvatarParametersStyled = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15px;

    > div {
        flex-basis: calc(50% - (15px / 2));
    }
`;

const FilterInputStyled = styled.input`
    ${globalInputStyle};
    width: 200px;
`;

const CollapseCheckboxStyled = styled.div<{ checked: boolean }>`
    ${globalInputStyle};
    cursor: pointer;
    width: 44px;
    font-size: 35px;

    i {
        visibility: ${props => props.checked ? 'visible' : 'hidden'};
    }
`;
