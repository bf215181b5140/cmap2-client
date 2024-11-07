import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FieldErrors, FieldValues, Path, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import useInputError from '../../../hooks/inputError.hook';
import InputErrorMessage from '../inputErrorMessage.component';
import { InputStyled } from '../input.style';
import IconButton from '../../buttons/iconButton.component';
import AvatarInputDropdown from './avatarInputDropdown.component';

interface AvatarInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  onSelection?: (avatarId: string) => void;
  placeholder?: string;
  errors?: FieldErrors;
  readOnly?: boolean;
  width?: string;
}

export default function AvatarInput<T extends FieldValues>({ name, register, setValue, onSelection, placeholder, errors, readOnly, width }: AvatarInputProps<T>) {

  const [hasError, errorMessage] = useInputError(name, errors);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement>(null);

  function onToggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  function onApplySelection(avatarId: string) {
    // @ts-ignore
    setValue(name, avatarId);
    setShowDropdown(false);
    if (onSelection) onSelection(avatarId);
  }

  return (<AvatarInputStyled ref={inputRef} style={{ width: width || '100%' }}>

    {/* Regular input */}
    <div style={{ display: 'inline-block', flex: '1' }}>
      <CustomInputStyled type={'text'} {...register(name)} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={width} />
      <InputErrorMessage errorMessage={errorMessage} />
    </div>

    {/* dropdown toggle button */}
    <CustomIconButtonStyled role={'normal'} tooltip={'Search avatars'} icon={'ri-menu-search-line'} onClick={onToggleDropdown} disabled={readOnly} />

    {/* Show dropdown */}
    {showDropdown && <AvatarInputDropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} onApplySelection={onApplySelection} inputRef={inputRef} />}

  </AvatarInputStyled>);

};

const AvatarInputStyled = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const CustomInputStyled = styled(InputStyled)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

const CustomIconButtonStyled = styled(IconButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0px;

  :hover {
    transform: scale(1);
  }
`;
