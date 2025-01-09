import styled from 'styled-components';

const Icon = styled.i<{ color?: string }>`
  vertical-align: text-bottom;
  margin-right: 2px;
  color: ${props => props.color ? props.color : props.theme.colors.font.icon};
`;

export default Icon;
