import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { globalInputStyle } from '../input.style';
import { ReactProps, theme } from 'cmap2-shared';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form/dist/types/form';
import InputErrorMessage from '../inputErrorMessage.component';
import useInputError from '../hooks/inputError.hook';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import SearchButton from '../../buttons/searchButton.component';
import { VrcOscAvatar, VrcOscAvatarParameterProperties } from '../../../../../../shared/types/osc';
import { SelectInputStyled } from './select.component';

interface SelectParameters {
    avatar: string;
    name: string;
    address: string;
    type: string;
    valueType: 'Int' | 'Float' | 'Bool';
}

interface ParameterInputProps extends ReactProps {
    name: string;
    register: UseFormRegister<any>;
    setValue: UseFormSetValue<any>;
    defaultAvatarId?: string;
    defaultType?: 'input' | 'output';
    onSelection?: (parameter: VrcOscAvatarParameterProperties) => void;
    placeholder?: string;
    errors?: FieldErrors;
    readOnly?: boolean;
    width?: string;
}

export default function ParameterInput({name, register, setValue, defaultAvatarId = '', defaultType = 'input', onSelection, placeholder, errors, readOnly, width}: ParameterInputProps) {

    const [hasError, errorMessage] = useInputError(name, errors);

    const [filterAvatarId, setFilterAvatarId] = useState<string>(defaultAvatarId);
    const [filterName, setFilterName] = useState<string>('');
    const [filterType, setFilterType] = useState<'input' | 'output'>(defaultType);
    const [unknownAvatar, setUnknownAvatar] = useState(true);

    const [avatars, setAvatars] = useState<VrcOscAvatar[]>([]);
    const [selectParameters, setSelectParameters] = useState<SelectParameters[]>([]);

    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [dropdownPosition, setDropdownPosition] = useState<React.CSSProperties>({top: '50px'});
    const inputRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.electronAPI.get('getVrcOscAvatars').then(data => setAvatars(data));

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

    useEffect(() => {
        const tempSelectParameters: SelectParameters[] = [];
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
                            name: param.name,
                            address: param[filterType]!.address,
                            type: filterType,
                            valueType: param[filterType]!.type
                        });
                    }
                });
            }
        });
        setSelectParameters(tempSelectParameters);
        // if default avatar id is something we can't find then show unknown avatar option in avatar select filter
        setUnknownAvatar(filterAvatarId !== '' && !avatars.find(avatar => avatar.id === filterAvatarId))
    }, [avatars, filterAvatarId, filterName, filterType]);

    useEffect(() => {
        // calculate dropdown position, prioritize on top of input and expanding torwards left
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
                style.top = '50px';
            } else {
                style.bottom = '50px';
            }

            setDropdownPosition(style);
        }
    }, [showDropdown, selectParameters]);

    function onToggleDropdown() {
        setShowDropdown(state => !state);
    }

    function onSelectParameter(param: SelectParameters) {
        setValue(name, param.address, {
            shouldValidate: true,
            shouldTouch: true,
            shouldDirty: true,
        });
        setShowDropdown(false);
        if (onSelection) onSelection({address: param.address, type: param.valueType});
    }

    return (<div ref={inputRef} style={{position: 'relative'}}>

        {/* Regular input */}
        <div style={{display: 'inline-block'}}>
            <ParameterInputStyled type={'text'} {...register(name)} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={width} />
            <InputErrorMessage errorMessage={errorMessage} />
        </div>

        {/* Toggle dropdown for parameters */}
        <SearchButton onClick={onToggleDropdown} disabled={readOnly} />

        {showDropdown && <SelectionStyled ref={dropdownRef} style={dropdownPosition}>

            {/* Avatar filter */}
            <SelectInputStyled value={filterAvatarId} onChange={(event) => setFilterAvatarId(event.target.value)} errors={false} width={'auto'}>
                <option value={''} key={'any'}>All</option>
                {unknownAvatar && (<option value={defaultAvatarId} key={defaultAvatarId}>Unknown avatar</option>)}
                {avatars.map(avatar => (<option value={avatar.id} key={avatar.id}>{avatar.name}</option>))}
            </SelectInputStyled>

            {/* Parameter name filter */}
            <FilterInputStyled placeholder={'Search by name'} value={filterName} onChange={(event) => setFilterName(event.target.value)} />

            {/* Parameter type filter */}
            <SelectInputStyled value={filterType} onChange={(event) => setFilterType(event.target.value as 'input' | 'output')} errors={false} width={'100px'}>
                <option value={'input'} key={'input'}>Input</option>
                <option value={'output'} key={'output'}>Output</option>
            </SelectInputStyled>

            {/* List all parameters */}
            <ul>
                {selectParameters.length > 0 ? (
                    selectParameters.map(param => (<li key={param.avatar + param.name + param.type} onClick={() => onSelectParameter(param)}>
                        <span className={'avatar'}>{param.avatar}</span>
                        <span className={'name'}>{param.name}</span>
                        <span className={'type'} style={{color: color(param.type)}}>
                        {param.type.charAt(0).toUpperCase() + param.type.slice(1)} {icon(param.type)}
                    </span>
                        <span className={'path'}> {param.address}</span>
                    </li>))
                ) : (
                    <div>No parameters match the filters</div>
                )}
            </ul>

        </SelectionStyled>}
    </div>);

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

const ParameterInputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
  margin-right: 0;
`;

const FilterInputStyled = styled.input`
  ${globalInputStyle};
  width: 200px;
`;

const SelectionStyled = styled.div`
  position: absolute;
  margin: 7px;
  padding: 0;
  width: max-content;
  max-width: 750px;
  color: ${props => props.theme.colors.font.text};
  background: ${props => props.theme.colors.ui.appBg};
  border: 2px solid ${props => props.theme.colors.input.border};
  border-color: ${props => props.theme.colors.input.border};
  border-radius: 7px;
  z-index: 2;
  box-shadow: 0 0 10px black;

  ul {
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
