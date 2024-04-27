import styled, { css } from 'styled-components';
import { globalInputStyle } from '../form/input.style';
import React, { useContext } from 'react';
import { ModalContext } from '../../../components/mainWindow/mainWindow.componenet';

type IconButtonSize = 'normal' | 'small' | 'tiny';

type IconButtonType = 'normal' | 'add' | 'delete' | 'edit' | 'save' | 'info' | 'reset';

interface IconButtonProps {
    type: IconButtonType;
    onClick?: () => void;
    icon?: string;
    tooltip?: string | false;
    disabled?: boolean;
    active?: boolean;
    size?: IconButtonSize;
    deleteKeyword?: string;
    className?: string;
}

export default function IconButton({ type, onClick, icon, tooltip, disabled, active, size = 'normal', deleteKeyword, className }: IconButtonProps) {

    const { deleteModal } = useContext(ModalContext);

    if (!icon) {
        switch (type) {
            case 'normal':
                icon = 'ri-link-m';
                break;
            case 'add':
                icon = 'ri-add-line';
                break;
            case 'delete':
                icon = 'ri-delete-bin-6-line';
                break;
            case 'edit':
                icon = 'ri-edit-line';
                break;
            case 'save':
                icon = 'ri-save-3-line';
                break;
            case 'info':
                icon = 'ri-question-line';
                break;
            case 'reset':
                icon = 'ri-loop-left-line';
                break;
        }
    }

    if (tooltip === undefined) {
        switch (type) {
            case 'add':
                tooltip = 'Add new';
                break;
            case 'delete':
                tooltip = 'Delete';
                break;
            case 'edit':
                tooltip = 'Edit';
                break;
            case 'save':
                tooltip = 'Save';
                break;
            case 'info':
                tooltip = 'Show info';
                break;
            case 'reset':
                tooltip = 'Reset';
                break;
        }
    }

    function onClickInternal() {
        if (!onClick) return;

        switch (type) {
            case 'delete':
                deleteModal(deleteKeyword || 'item', onClick);
                break;
            default:
                onClick();
        }
    }

    return (<IconButtonStyled type={type === 'save' ? 'submit' : 'button'} styleType={type} size={size} disabled={!!disabled} data-active={active}
                              onClick={() => onClickInternal()} className={className}>
        <i className={icon} />
        {tooltip && <span>{tooltip}</span>}
    </IconButtonStyled>);
}

// <IconButton type={'add'} tooltip={false} size={'tiny'} onClick={() => {}} />
// <IconButton type={'add'} tooltip={'Custom tooltip'} size={'small'} onClick={() => {}} />
// <IconButton type={'add'} size={'normal'} onClick={() => {}} />
//
// <IconButton type={'edit'} size={'normal'} onClick={() => {}} />
// <IconButton type={'delete'} size={'normal'} onClick={() => {}} />
// <IconButton type={'save'} size={'normal'} onClick={() => {}} />
// <IconButton type={'reset'} size={'normal'} onClick={() => {}} />
// <IconButton type={'info'} size={'normal'} onClick={() => {}} />
// <IconButton type={'normal'} size={'normal'} onClick={() => {}} />
// <IconButton type={'normal'} tooltip={'With tooltip'} size={'normal'} onClick={() => {}} />

const IconButtonStyled = styled.button<{ styleType: IconButtonType, size: IconButtonSize }>`
  ${globalInputStyle};
  cursor: pointer;
  vertical-align: top;
  position: relative;
  color: ${props => props.theme.colors.font.text};

  // Style type
  ${props => {
    switch (props.styleType) {
      case 'normal':
        return null;
      case 'add':
        return styleAdd;
      case 'delete':
        return styleDelete;
      case 'edit':
        return styleEdit;
      case 'save':
        return styleSave;
      case 'info':
        return styleInfo;
      case 'reset':
        return styleReset;
    }
  }}
    // size
  ${props => {
    switch (props.size) {
      case 'normal':
        return sizeNormal;
      case 'small':
        return sizeSmall;
      case 'tiny':
        return sizeTiny;
    }
  }}
  span {
    position: absolute;
    top: -35px;
    width: max-content;
    font-size: 16px;
    background: #111;
    padding: 4px 12px;
    border-radius: 8px;
    display: none;
    color: ${props => props.theme.colors.font.text};
  }

  :hover {
    span {
      animation: slideUp 200ms;
      display: block;
    }
  }

  :disabled {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    background: ${props => props.theme.colors.input.bg};
    border-color: ${props => props.theme.colors.input.border};
    filter: saturate(0%);
  }

  @keyframes slideUp {
    from {
      top: -15px;
      opacity: 0;
    }
    to {
      top: -35px;
      opacity: 1;
    }
  }
`;

const styleAdd = css`
  background: #326748;
  border-color: #3c7a56;

  :hover, &[data-active='true'] {
    background: #3b7954;
    border-color: #5fbe87;
  }
`;

const styleDelete = css`
  background: #ab4c4c;
  border-color: #b75252;

  :hover, &[data-active] {
    background: #bd5555;
    border-color: #ff8484;
  }
`;

const styleEdit = css`
  background: #a98934;
  border-color: #be9a38;

  :hover, &[data-active='true'] {
    background: #b49138;
    border-color: #e5ba48;
  }
`;

const styleSave = css`
  background: #14798f;
  border-color: #1688a1;
  animation: 750ms ease-in infinite alternate saveBlinking;

  :hover, &[data-active='true'] {
    background: #15829a;
    border-color: #2fc7e7;
    animation: none;
  }

  :disabled {
    animation: none;
  }

  @keyframes saveBlinking {
    from {
      border-color: #1688a1;
    }
    to {
      border-color: #2fc7e7;
    }
  }
`;

const styleInfo = css`
  background: #30597c;
  border-color: #3b6d96;

  :hover, &[data-active='true'] {
    background: #38678f;
    border-color: #5ea9e3;
  }
`;

const styleReset = css`
  background: #af6d37;
  border-color: #c97b3d;

  :hover, &[data-active='true'] {
    background: #b67139;
    border-color: #f6a25a;
  }
`;

const sizeNormal = css`
  width: 44px;
  height: 44px;
  font-size: 28px;

  :hover {
    transform: scale(1.05);
  }
`;

const sizeSmall = css`
  width: 36px;
  height: 36px;
  font-size: 22px;

  :hover {
    transform: scale(1.08);
  }
`;

const sizeTiny = css`
  width: 28px;
  height: 28px;
  font-size: 18px;

  :hover {
    transform: scale(1.12);
  }
`;
