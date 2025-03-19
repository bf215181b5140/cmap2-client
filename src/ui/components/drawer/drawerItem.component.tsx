import styled, { css } from 'styled-components';
import { NotificationType } from 'cmap-shared';

const DrawerItem = styled.div<{ notificationType?: NotificationType }>`
  padding: 8px;
  background: ${props => props.theme.colors.ui.background3};
  border: 1px solid transparent;
  border-radius: 6px;
  width: 100%;
  
  ${props => {
  switch (props.notificationType) {
    case 'Warning':
      return css`border-color: ${props => props.theme.colors.warning};`;
    case 'Error':
      return css`border-color: ${props => props.theme.colors.error};`;
    case 'Success':
      return css`border-color: ${props => props.theme.colors.success};`;
    case 'Info':
      return css`border-color: ${props => props.theme.colors.info};`;
  }
}}
`;

export default DrawerItem;