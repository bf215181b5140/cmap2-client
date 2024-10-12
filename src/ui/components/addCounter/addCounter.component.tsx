import styled from 'styled-components';
import { ReactProps } from '../../types';

interface AddCounterProps extends ReactProps {
  canAddMore: boolean;
}

export default function AddCounter({ canAddMore, children }: AddCounterProps) {
  return (<AddCounterStyled canAddMore={canAddMore}>
    {children}
  </AddCounterStyled>);
}

const AddCounterStyled = styled.span<{ canAddMore: boolean }>`
    margin: 5px;
    color: ${props => props.canAddMore ? props.theme.colors.font.text : props.theme.colors.error};
`;