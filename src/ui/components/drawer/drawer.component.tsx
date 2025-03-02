import styled from 'styled-components';
import { ReactProps } from '../../types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NotificationType } from 'cmap2-shared';
import { theme } from 'cmap2-shared/react';

interface DrawerProps extends ReactProps {
  icon: string;
  title?: string;
  emptyMessage?: string;
  notificationType?: NotificationType;
}

export default function Drawer({ icon, title, emptyMessage, notificationType, children }: DrawerProps) {

  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const color = useMemo(() => {
    switch (notificationType) {
      case 'Info':
        return theme.colors.info;
      case 'Success':
        return theme.colors.success;
      case 'Warning':
        return theme.colors.warning;
      case 'Error':
        return theme.colors.error;
      default:
        return theme.colors.font.textInactive;
    }
  }, [notificationType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        setShowDrawer(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return(<DrawerStyled color={color}>
    <i className={icon} onClick={() => setShowDrawer(!showDrawer)} aria-current={showDrawer} />
    {showDrawer && <DrawerPopupStyled ref={ref}>
      {title && <h2>{title}</h2>}
      {children}
      {(!children && emptyMessage) && <div className={'emptyMessage'}>{emptyMessage}</div> }
    </DrawerPopupStyled>}
  </DrawerStyled>

  )
}

const DrawerStyled = styled.div<{ color: string }>`
  position: relative;

  i {
    font-size: 32px;
    padding: 0 4px;
    cursor: pointer;
    color: ${props => props.color};
    transition: 0.1s linear;

    :hover, &[aria-current='true'] {
      color: ${props => props.theme.colors.font.icon};
    }
  }
`;

const DrawerPopupStyled = styled.div`
  padding: 8px;
  background: ${props => props.theme.colors.ui.appBgOpaque}dd;
  backdrop-filter: blur(2px);
  border: 2px solid ${props => props.theme.colors.ui.background5};
  border-radius: 8px;
  box-shadow: 0 0 8px black;
  transition: 0.1s linear;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  min-height: 60px;
  max-height: 450px;
  min-width: 350px;
  max-width: 500px;
  width: max-content;
  overflow: auto;

  position: absolute;
  top: 45px;
  right: -15px;
  
  h2 {
    margin: 0;
  }
  
  div.emptyMessage {
    margin: 10px;
  }
`;
