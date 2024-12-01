import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ReactProps } from '../../../types';
import { VrcOscAvatar } from '../../../../shared/objects/vrcOscAvatar';
import { InputStyled } from '../input.style';

interface AvatarInputDropdownProps extends ReactProps {
  showDropdown: boolean;
  setShowDropdown: Dispatch<SetStateAction<boolean>>;
  onApplySelection: (avatarId: string) => void;
  inputRef: React.RefObject<HTMLDivElement>;
}

export default function AvatarInputDropdown({ showDropdown, setShowDropdown, onApplySelection, inputRef }: AvatarInputDropdownProps) {

  const [filterName, setFilterName] = useState<string>('');
  const [avatars, setAvatars] = useState<VrcOscAvatar[]>([]);

  const [dropdownPosition, setDropdownPosition] = useState<React.CSSProperties | undefined>();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filteredAvatars = avatars.filter(a => !filterName || a.name.toLowerCase().includes(filterName.toLowerCase()));

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
  }, [showDropdown]);

  return (<DropdownStyled ref={dropdownRef} style={dropdownPosition}>

    {/* Avatar name filter */}
    <div className={'avatarInputDropdownFilters'}>
      <InputStyled autoFocus placeholder={'Search by name'} value={filterName} onChange={(event) => setFilterName(event.target.value)} />
    </div>

    {/* List all parameters */}
    <div className={'avatarInputDropdownContent'}>
      <ul>
        {filteredAvatars.map(avatar => (
          <li key={avatar.id} onClick={() => onApplySelection(avatar.id)}>
            <span className={'name'}>{avatar.name}</span>
            <span className={'avatarId'}>{avatar.id}</span>
            <span className={'parameterCount'}>Parameters: {avatar.parameters.length}</span>
          </li>))}
      </ul>
      {filteredAvatars.length === 0 && <div>No avatars found</div>}
    </div>

  </DropdownStyled>);
};

const DropdownStyled = styled.div`
    position: absolute;
    margin: 7px;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: max-content;
    max-width: 700px;
    color: ${props => props.theme.colors.font.text};
    background: ${props => props.theme.colors.ui.appBg};
    border: 2px solid ${props => props.theme.colors.input.border};
    border-color: ${props => props.theme.colors.input.border};
    border-radius: 7px;
    z-index: 2;
    box-shadow: 0 0 10px black;

    > div {
        &.avatarInputDropdownFilters {
            display: flex;
            flex-direction: row;
            gap: 4px;
        }

        &.avatarInputDropdownContent > div {
            padding: 7px 60px;
            text-align: center;
        }

        > ul {
            padding-inline-start: 0;
            margin: 0;
            padding: 0;
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

                .avatarId, .parameterCount {
                    font-weight: normal;
                    font-family: Noto-Sans-Regular, serif;
                    color: ${props => props.theme.colors.input.textDisabled};
                }

                :hover {
                    background: ${props => props.theme.colors.input.bg};
                    border-color: ${props => props.theme.colors.input.hoverBorder};
                }
            }
        }
    }
`;
