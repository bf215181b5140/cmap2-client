import styled from 'styled-components';
import { ReactProps } from '../../../types';

export default function SegmentMenu({ children }: ReactProps) {
  return (<SegmentMenuStyled>
    {children}
  </SegmentMenuStyled>);
}

const SegmentMenuStyled = styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
    justify-content: center;
    margin-bottom: 12px;
`;