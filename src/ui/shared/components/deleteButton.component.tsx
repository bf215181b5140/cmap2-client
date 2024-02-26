import styled from 'styled-components';
import { useContext } from 'react';
import { ModalContext } from '../../app/mainWindow/mainWindow.componenet';
import { globalInputStyle } from './form/input.style';
import colors from 'cmap2-shared/src/colors.json';

interface DeleteButtonProps {
    keyword: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

export default function DeleteButton({keyword, onClick, disabled, className}: DeleteButtonProps) {

    const {deleteModal} = useContext(ModalContext);

    return (<DeleteButtonStyled onClick={() => deleteModal(keyword, onClick)} disabled={!!disabled} className={className}>
        <i className={'ri-delete-bin-6-line'} />
    </DeleteButtonStyled>);
}

const DeleteButtonStyled = styled.button`
  ${globalInputStyle};
  width: 44px;
  cursor: pointer;
  background: indianred;
  border-color: indianred;
  color: lightgray;
  font-size: 25px;
  vertical-align: top;

  :hover {
    transform: scale(1.05);
    background: indianred;
    border-color: lightgray;
    color: whitesmoke;
  }

  :disabled {
    pointer-events: none;
    color: ${colors['font-text-disabled']};
    background: ${colors['ui-primary-1']};
    border-color: ${colors['ui-primary-2']};
    filter: saturate(0%);
  }
`;
