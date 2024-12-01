import styled, { css, DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import { StyleDTO } from 'cmap2-shared';

export const LAYOUT_ELEMENT_GAP = '20px';

const Layout = styled.div<{ style: StyleDTO }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
  gap: ${LAYOUT_ELEMENT_GAP};
  width: 100%;
  border-radius: 8px;

  ${props => layoutStyles[props.style.id]};
`;

export default Layout;

const layoutStyles: { [key: string]: FlattenInterpolation<ThemeProps<DefaultTheme>> } = {};

layoutStyles.vrcGreen = css`
  background: ${props => props.theme.colors.ui.appBgOpaque};
`;

layoutStyles.vrcGrey = css`
  background: ${props => props.theme.colors.ui.appBgOpaque};
`;
