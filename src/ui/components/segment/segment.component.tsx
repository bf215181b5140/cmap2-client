import styled from 'styled-components';
import React, { useState } from 'react';
import IconButton from '../buttons/iconButton.component';
import { PAGE_ELEMENT_GAP } from '../page/page.component';
import LoadingSpinner from '../loadingSpinner/loadingSpinner.component';
import { ReactProps } from '../../types';
import { GroupWidth } from 'cmap2-shared';

interface SegmentProps extends ReactProps {
  segmentTitle?: string;
  toggleTitle?: string;
  infoContent?: React.JSX.Element;
  width?: GroupWidth | string;
  loading?: boolean;
}

export default function Segment({ segmentTitle, toggleTitle, infoContent, width, loading = false, children }: SegmentProps) {

  const [shown, setShown] = useState<boolean>(!toggleTitle);
  const [infoShown, setInfoShown] = useState<boolean>(false);

  function getFlexBasis(): string | undefined {
    if (!width) return undefined;
    switch (width) {
      case 'None':
        return '0';
      case 'Third':
        return `calc(100% * (1 / 3) - ${PAGE_ELEMENT_GAP})`;
      case 'Half':
        return `calc(100% * (1 / 2) - ${PAGE_ELEMENT_GAP})`;
      case 'Full':
        return `calc(100%)`;
      default:
        return width;
    }
  }

  return (<SegmentWrapper flex={getFlexBasis()}>

    {/* Toggle title */}
    {toggleTitle && <SegmentTitle shown={shown}>
      <h2 onClick={() => setShown(!shown)}>
        <i className={'ri-arrow-down-s-line'} />
        {toggleTitle}
      </h2>
    </SegmentTitle>}

    {/* Main box */}
    {shown && <SegmentStyled>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {infoContent && <FloatIconButton role={'info'} size={'small'} active={infoShown} onClick={() => setInfoShown(!infoShown)} />}
          {segmentTitle && <h2 style={{ marginTop: 0 }}>{segmentTitle}</h2>}
          {infoShown && infoContent}
          {children}
        </>
      )}
    </SegmentStyled>}
  </SegmentWrapper>);
}

const SegmentWrapper = styled.div<{ flex?: string }>`
  flex: ${props => props.flex || '0'};
`;

const SegmentTitle = styled.div<{ shown: boolean }>`
  color: ${props => props.theme.colors.font.h2};

  h2 {
    display: inline-block;
    margin: 5px;
    cursor: pointer;

    i {
      display: inline-block;
      transition: transform 0.1s linear;
      transform: rotate(${props => props.shown ? '0' : '-90deg'});
    }
  }
`;

const FloatIconButton = styled(IconButton)`
  float: right;
  margin: 0 0 7px 7px;
`;

const SegmentStyled = styled.div`
  background-color: ${props => props.theme.colors.ui.background3};
  border-radius: 8px;
  padding: 15px;
`;
