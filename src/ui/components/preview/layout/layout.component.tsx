import styled from 'styled-components';
import { StyleDTO } from 'cmap2-shared';

const Layout = styled.div<{ style?: StyleDTO }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
  width: 100%;
`;

export default Layout