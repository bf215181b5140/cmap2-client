import styled from 'styled-components';

const FormControlBar = styled.div<{ justifyContent?: string, position?: 'above' | 'below' }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: ${props => props.justifyContent ?? 'flex-end'};
  align-items: center;
  margin: ${props => props.position === 'above' ? '12px 0' : '12px 0 0 0'};
  gap: 6px;

  hr {
    height: 28px;
  }
`;

export default FormControlBar;