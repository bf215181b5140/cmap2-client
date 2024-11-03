import styled from 'styled-components';

const LayoutButton = styled.div.attrs(() => ({ className: 'layoutButton' }))`
  width: 100%;
  margin-bottom: 20px;
  break-inside: avoid-column;
`;

export default LayoutButton;