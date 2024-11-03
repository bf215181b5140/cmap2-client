import styled from 'styled-components';
import { ReactProps } from '../../types';

const AddCounter = styled.span<{ canAddMore: boolean }>`
    margin: 5px;
    color: ${props => props.canAddMore ? props.theme.colors.success : props.theme.colors.error};
`;

export default AddCounter;