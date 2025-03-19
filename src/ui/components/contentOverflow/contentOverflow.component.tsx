import { ReactProps } from '../../types';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ContentOverflow({ children }: ReactProps) {
  const location = useLocation();
  const contentOverflowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentOverflowRef.current) contentOverflowRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (<ContentOverflowStyled ref={contentOverflowRef}>
    {children}
  </ContentOverflowStyled>)
}

const ContentOverflowStyled = styled.div`
  overflow: auto;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
`;
