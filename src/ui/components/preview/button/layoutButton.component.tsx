import styled from 'styled-components';

const LayoutButton = styled.div.attrs(() => ({ className: 'layoutButton' }))<{ height: string }>`
  width: 100%;
  margin-bottom: 20px;
  break-inside: avoid-column;

  height: ${props => props.height};
  background: darkslateblue;
`;

export default LayoutButton;