import { ReactProps } from 'cmap2-shared';
import { VrcOscAvatarParameter } from '../../../../shared/types/osc';
import styled from 'styled-components';
import { SelectInputStyled } from '../../../shared/components/form/inputs/select.component';
import React, { useState } from 'react';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import { globalInputStyle } from '../../../shared/components/form/input.style';
import AvatarParameter from './avatarParameter.component';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface AvatarParametersProps extends ReactProps {
    avatarId: string;
    parameters: VrcOscAvatarParameter[];
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
    inEdit: boolean;
}

const sortOrder = [
    {key: 'none', value: 'None'},
    {key: 'asc', value: 'Ascending'},
    {key: 'desc', value: 'Descending'}
];

export default function AvatarParameters({avatarId, parameters, avatarsDispatch, inEdit}: AvatarParametersProps) {

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
            {filteredParameters().map(parameter => (<AvatarParameter avatarId={avatarId} parameter={parameter} avatarsDispatch={avatarsDispatch} inEdit={inEdit}
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
