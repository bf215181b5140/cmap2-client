import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FieldErrors, FieldValues, Path, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import ParameterDropdown from './parameterDropdown.component';
import { ReactProps } from '../../../types';
import { VrcOscAvatarParameterProperties } from '../../../../shared/objects/vrcOscAvatar';
import useInputError from '../../../hooks/inputError.hook';
import InputErrorMessage from '../inputErrorMessage.component';
import IconButton from '../../buttons/iconButton.component';
import { globalInputStyle } from '../input.style';

interface ParameterInputProps<T extends FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  defaultAvatarVrcId?: string;
  defaultType?: 'input' | 'output';
  onSelection?: (parameter: VrcOscAvatarParameterProperties) => void;
  placeholder?: string;
  errors?: FieldErrors;
  readOnly?: boolean;
  width?: string;
}

export default function ParameterInput<T extends FieldValues>({ name, register, setValue, defaultAvatarVrcId, defaultType, onSelection, placeholder, errors, readOnly, width }: ParameterInputProps<T>) {

  const [hasError, errorMessage] = useInputError(name, errors);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const inputRef = useRef<HTMLDivElement>(null);

  function onToggleDropdown() {
    setShowDropdown(state => !state);
  }

  function onApplyParameter(param: VrcOscAvatarParameterProperties) {
    setValue(name, param.address, {
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: true,
    });
    setShowDropdown(false);
    if (onSelection) onSelection({ address: param.address, type: param.type });
  }

  return (<div ref={inputRef} style={{ position: 'relative' }}>

    {/* Regular input */}
    <div style={{ display: 'inline-block' }}>
      <ParameterInputStyled type={'text'} {...register(name)} placeholder={placeholder} errors={hasError} readOnly={readOnly} width={width} />
      <InputErrorMessage errorMessage={errorMessage} />
    </div>

    {/* Toggle dropdown for parameters */}
    <IconButton role={'normal'} tooltip={'Search parameters'} icon={'ri-menu-search-line'} onClick={onToggleDropdown} disabled={readOnly} />

    {/* Show dropdown parameter picker */}
    {showDropdown && <ParameterDropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} onApplyParameter={onApplyParameter}
                                        defaultAvatarVrcId={defaultAvatarVrcId} defaultType={defaultType}
                                        inputRef={inputRef} />}
  </div>);

};

const ParameterInputStyled = styled.input<{ errors: boolean, width?: string }>`
  ${globalInputStyle};
  margin-right: 0;
`;