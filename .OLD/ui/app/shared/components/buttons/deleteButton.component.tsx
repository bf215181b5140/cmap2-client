import styled, { css } from 'styled-components';
import { useContext } from 'react';
import { ModalContext } from '../../../components/mainWindow/mainWindow.componenet';
import { globalInputStyle } from '../form/input.style';

interface DeleteButtonProps {
    keyword: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    size?: 'normal' | 'small';
}

export default function DeleteButton({ keyword, onClick, disabled, className, size = 'normal' }: DeleteButtonProps) {

    const { deleteModal } = useContext(ModalContext);

    return (<DeleteButtonStyled type={'button'} onClick={() => deleteModal(keyword, onClick)} disabled={!!disabled} className={className} size={size}>
        <i className={'ri-delete-bin-6-line'} />
    </DeleteButtonStyled>);
}

const DeleteButtonStyled = styled.button<{ size: 'normal' | 'small' }>`
  ${globalInputStyle};
  cursor: pointer;
  background: indianred;
  border-color: indianred;
  color: lightgray;
  vertical-align: top;

  ${props => {
    switch (props.size) {
      case 'normal':
        return css`
          width: 44px;
          height: 44px;
          font-size: 25px;
        `;
      case 'small':
        return css`
          width: 36px;
          height: 36px;
          font-size: 22px;
        `;
    }
  }}
  
  :hover {
    transform: scale(1.05);
    background: indianred;
    border-color: lightgray;
    color: whitesmoke;
  }

  :disabled {
    pointer-events: none;
    color: ${props => props.theme.colors.input.textDisabled};
    background: ${props => props.theme.colors.input.bg};
    border-color: ${props => props.theme.colors.input.border};
    filter: saturate(0%);
  }
`;
