import styled, { css } from 'styled-components';
import React, { useContext } from 'react';
import { globalInputStyle } from '../input/input.style';
import { ModalContext } from '../context/modal.context';
import BasicModal from '../modal/basicModal/basicModal.component';
import DeleteModal from '../modal/deleteModal/deleteModal.component';

type IconButtonSize = 'normal' | 'small' | 'tiny';

type IconButtonRole = 'normal' | 'add' | 'delete' | 'remove' | 'edit' | 'save' | 'info' | 'reset';

interface IconButtonProps {
  role: IconButtonRole;
  onClick?: () => void;
  icon?: string;
  tooltip?: string | false;
  disabled?: boolean;
  active?: boolean;
  size?: IconButtonSize;
  deleteKeyword?: string;
  className?: string;
  name?: string;
  margin?: string;
  type?: 'submit' | 'button';
}

export default function IconButton({ role, onClick, icon, tooltip, disabled, active, size = 'normal', deleteKeyword, className, name, margin, type }: IconButtonProps) {

  const { setModal } = useContext(ModalContext);

  if (!icon) {
    switch (role) {
      case 'normal':
        icon = 'ri-link-m';
        break;
      case 'add':
        icon = 'ri-add-line';
        break;
      case 'delete':
      case 'remove':
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
    switch (role) {
      case 'add':
        tooltip = 'Add new';
        break;
      case 'delete':
        tooltip = 'Delete';
        break;
      case 'remove':
        tooltip = 'Remove';
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

  if (type === undefined) {
    if (role === 'save') {
      type = 'submit';
    } else {
      type = 'button';
    }
  }

  function onClickInternal() {
    if (!onClick) return;

    switch (role) {
      case 'delete':
        setModal(<DeleteModal keyword={deleteKeyword || 'item'} confirmFunction={onClick} />);
        break;
      default:
        onClick();
    }
  }

  return (<IconButtonStyled type={type} role={role} size={size} disabled={!!disabled} data-active={active}
                            onClick={() => onClickInternal()} className={className} name={name} margin={margin}>
    <i className={icon} />
    {tooltip && <span>{tooltip}</span>}
  </IconButtonStyled>);
}

const IconButtonStyled = styled.button<{ role: IconButtonRole, size: IconButtonSize, margin?: string }>`
  ${globalInputStyle};
  margin: ${props => props.margin ? props.margin : '0'};
  cursor: pointer;
  vertical-align: top;
  position: relative;
  color: ${props => props.theme.colors.font.text};

  // Style type
  ${props => {
    switch (props.role) {
      case 'normal':
        return null;
      case 'add':
        return styleAdd;
      case 'delete':
      case 'remove':
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
  }};

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
  }};

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
      animation: iconButtonTooltip 150ms;
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

  @keyframes iconButtonTooltip {
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
  background: ${props => props.theme.colors.buttons.add.bg};
  border-color: ${props => props.theme.colors.buttons.add.border};

  :hover, &[data-active='true'] {
    background: ${props => props.theme.colors.buttons.add.hoverBg};
    border-color: ${props => props.theme.colors.buttons.add.hoverBorder};
  }
`;

const styleDelete = css`
  background: ${props => props.theme.colors.buttons.delete.bg};
  border-color: ${props => props.theme.colors.buttons.delete.border};

  :hover, &[data-active='true'] {
    background: ${props => props.theme.colors.buttons.delete.hoverBg};
    border-color: ${props => props.theme.colors.buttons.delete.hoverBorder};
  }
`;

const styleEdit = css`
  background: ${props => props.theme.colors.buttons.edit.bg};
  border-color: ${props => props.theme.colors.buttons.edit.border};

  :hover, &[data-active='true'] {
    background: ${props => props.theme.colors.buttons.edit.hoverBg};
    border-color: ${props => props.theme.colors.buttons.edit.hoverBorder};
  }
`;

const styleSave = css`
  background: ${props => props.theme.colors.buttons.save.bg};
  border-color: ${props => props.theme.colors.buttons.save.border};
  animation: 750ms ease-in infinite alternate saveBlinking;

  :hover, &[data-active='true'] {
    background: ${props => props.theme.colors.buttons.save.hoverBg};
    border-color: ${props => props.theme.colors.buttons.save.hoverBorder};
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
  background: ${props => props.theme.colors.buttons.info.bg};
  border-color: ${props => props.theme.colors.buttons.info.border};

  :hover, &[data-active='true'] {
    background: ${props => props.theme.colors.buttons.info.hoverBg};
    border-color: ${props => props.theme.colors.buttons.info.hoverBorder};
  }
`;

const styleReset = css`
  background: ${props => props.theme.colors.buttons.reset.bg};
  border-color: ${props => props.theme.colors.buttons.reset.border};

  :hover, &[data-active='true'] {
    background: ${props => props.theme.colors.buttons.reset.hoverBg};
    border-color: ${props => props.theme.colors.buttons.reset.hoverBorder};
  }
`;

const sizeNormal = css`
  width: 44px;
  height: 44px;
  font-size: 28px;

  :hover {
    transform: scale(1.08);
  }
`;

const sizeSmall = css`
  width: 36px;
  height: 36px;
  font-size: 22px;

  :hover {
    transform: scale(1.1);
  }
`;

const sizeTiny = css`
  width: 28px;
  height: 28px;
  font-size: 18px;

  :hover {
    transform: scale(1.15);
  }
`;
