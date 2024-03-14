import styled from 'styled-components';
import { useContext } from 'react';
import { ModalContext } from '../../components/mainWindow/mainWindow.componenet';
import { globalInputStyle } from './form/input.style';

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
    color: ${props => props.theme.colors.input.textDisabled};
    background: ${props => props.theme.colors.input.bg};
    border-color: ${props => props.theme.colors.input.border};
    filter: saturate(0%);
  }
`;
