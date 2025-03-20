import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ReactProps } from '../../../types';
import { VrcOscAvatar, VrcOscAvatarParameterProperties } from '../../../../shared/objects/vrcOscAvatar';
import { InputStyled, SelectInputStyled } from '../input.style';
import { theme } from '../../../style/theme';

export interface ParameterDropdownParameter {
  avatar: string;
  avatarId: string;
  name: string;
  address: string;
  type: string;
  valueType: 'Int' | 'Float' | 'Bool';
}

interface ParameterDropdownProps extends ReactProps {
  showDropdown: boolean;
  setShowDropdown: Dispatch<SetStateAction<boolean>>;
  onApplyParameter: (param: VrcOscAvatarParameterProperties) => void;
  defaultAvatarVrcId?: string;
  defaultType?: 'input' | 'output';
  inputRef: React.RefObject<HTMLDivElement>;
}

export default function ParameterDropdown({ showDropdown, setShowDropdown, onApplyParameter, defaultAvatarVrcId = '', defaultType = 'input', inputRef }: ParameterDropdownProps) {

  const [filterAvatarId, setFilterAvatarId] = useState<string>(defaultAvatarVrcId);
  const [filterName, setFilterName] = useState<string>('');
  const [filterType, setFilterType] = useState<'input' | 'output'>(defaultType);

  const [avatars, setAvatars] = useState<VrcOscAvatar[]>([]);

  const [dropdownPosition, setDropdownPosition] = useState<React.CSSProperties | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.IPC.get('getAvatars').then(data => setAvatars(data));

    // close dropdown when clicked outside
    function handleClickOutside(event: MouseEvent) {
      if (!dropdownRef?.current?.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // if default avatar id is something we can't find then show unknown avatar option in avatar select filter
  const unknownAvatar = filterAvatarId !== '' && !avatars.find(avatar => avatar.id === filterAvatarId);

  // Which parameters are shown in the dropdown (based on filters)
  const dropdownParameters = useMemo(() => {
    const tempSelectParameters: ParameterDropdownParameter[] = [];
    // Filter avatars
    avatars.forEach(avatar => {
      if (filterAvatarId === '' || filterAvatarId === avatar.id) {
        // filter parameters by name
        avatar.parameters.forEach(param => {
          if (!param.name.toLowerCase().includes(filterName.toLowerCase())) return;
          // filter parameters by type
          if (Object.hasOwn(param, filterType) && param[filterType] !== undefined) {
            // add to select parameters
            tempSelectParameters.push({
              avatar: avatar.name,
              avatarId: avatar.id,
              name: param.name,
              address: param[filterType]!.address,
              type: filterType,
              valueType: param[filterType]!.type
            });
          }
        });
      }
    });

    return tempSelectParameters;
  }, [avatars, filterAvatarId, filterName, filterType]);

  // calculate dropdown position, prioritize on bottom of input and expanding towards left
  useEffect(() => {
    if (inputRef.current && dropdownRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const spaceTop = window.innerHeight - inputRect.top;
      const spaceLeft = window.innerWidth - inputRect.left;
      const style: React.CSSProperties = {};

      if (spaceLeft >= dropdownRect.width) {
        style.left = '0';
      } else {
        style.left = '-' + (dropdownRect.width - spaceLeft + 30) + 'px';
      }

      if (spaceTop >= dropdownRect.height) {
        style.top = '40px';
      } else {
        style.bottom = '40px';
      }

      setDropdownPosition(style);
    }
  }, [showDropdown, dropdownParameters]);

  return (<DropdownStyled ref={dropdownRef} style={dropdownPosition}>

    <div className={'filters'}>
      {/* Avatar filter */}
      <SelectInputStyled value={filterAvatarId} onChange={(event) => setFilterAvatarId(event.target.value)} errors={false} width={'auto'}>
        <option value={''} key={'any'}>All</option>
        {unknownAvatar && (<option value={defaultAvatarVrcId} key={defaultAvatarVrcId}>Unknown avatar</option>)}
        {avatars.map(avatar => (<option value={avatar.id} key={avatar.id}>{avatar.name}</option>))}
      </SelectInputStyled>

      {/* Parameter name filter */}
      <InputStyled autoFocus placeholder={'Search by parameter name'} value={filterName} width={'230px'} onChange={(event) => setFilterName(event.target.value)} />

      {/* Parameter type filter */}
      <SelectInputStyled value={filterType} onChange={(event) => setFilterType(event.target.value as 'input' | 'output')} errors={false} width={'100px'}>
        <option value={'input'} key={'input'}>Input</option>
        <option value={'output'} key={'output'}>Output</option>
      </SelectInputStyled>
    </div>

    {/* List all parameters */}
    <ul>
      {dropdownParameters.length > 0 ? (
        dropdownParameters.map(param => (<li key={param.avatarId + param.name + param.type} onClick={() => onApplyParameter({ address: param.address, type: param.valueType })}>
          <span className={'avatar'}>{param.avatar}</span>
          <span className={'name'}>{param.name}</span>
          <span className={'valueType'}>{param.valueType}</span>
          <span className={'type'} style={{ color: color(param.type) }}>
                            {param.type.charAt(0).toUpperCase() + param.type.slice(1)} {icon(param.type)}
                        </span>
          <span className={'path'}> {param.address}</span>
        </li>))
      ) : (
        <div>No parameters match the filters</div>
      )}
    </ul>

  </DropdownStyled>);
};

function icon(type: string) {
  switch (type) {
    case 'input':
      return (<i className="ri-arrow-right-line" />);
    case 'output':
      return (<i className="ri-arrow-left-line" />);
  }
}

function color(type: string) {
  switch (type) {
    case 'input':
      return theme.colors.vrchat.parameterInput;
    case 'output':
      return theme.colors.vrchat.parameterOutput;
    default:
      return theme.colors.font.text;
  }
}

const DropdownStyled = styled.div`
  position: absolute;
  margin: 7px;
  padding: 0;
  width: max-content;
  max-width: 900px;
  color: ${props => props.theme.colors.font.text};
  background: ${props => props.theme.colors.ui.appBg};
  border: 2px solid ${props => props.theme.colors.input.border};
  border-color: ${props => props.theme.colors.input.border};
  border-radius: 7px;
  z-index: 2;
  box-shadow: 0 0 10px black;
  
  .filters {
    display: flex;
    flex-direction: row;
    padding: 5px;
    gap: 5px;
  }

  ul {
    padding-inline-start: 5px;
    margin: 0;
    padding: 5px;
    overflow: auto;
    list-style: none;
    max-height: 300px;

    li {
      margin: 0;
      padding: 7px 7px;
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: 7px;

      span {
        padding-right: 10px;
      }

      span:last-child {
        padding: 0;
      }

      .name {
      }

      .type {
      }

      .valueType {
        color: ${props => props.theme.colors.input.textDisabled};
      }

      .avatar, .path {
        font-weight: normal;
        font-family: Noto-Sans-Regular, serif;
        color: ${props => props.theme.colors.input.textDisabled};
      }

      :hover {
        background: ${props => props.theme.colors.input.hoverBg};
        border-color: ${props => props.theme.colors.input.hoverBorder};
      }
    }

    > div {
      margin: 10px;
      text-align: center;
    }
  }
`;
