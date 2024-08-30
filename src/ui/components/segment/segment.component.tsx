import styled from 'styled-components';
import React, { useState } from 'react';
import { ReactProps, SegmentWidth } from 'cmap2-shared';
import IconButton from '../buttons/iconButton.component';
import { PAGE_ELEMENT_GAP } from '../page/page.component';
import LoadingSpinner from '../loadingSpinner/loadingSpinner.component';

interface SegmentProps extends ReactProps {
    segmentTitle?: string;
    toggleTitle?: string;
    infoContent?: React.JSX.Element;
    flexGrow?: number | string;
    flexBasis?: string | SegmentWidth;
    loading?: boolean;
}

export default function Segment({ segmentTitle, toggleTitle, infoContent, flexGrow, flexBasis, loading = false, children }: SegmentProps) {

    const [shown, setShown] = useState<boolean>(!toggleTitle);
    const [infoShown, setInfoShown] = useState<boolean>(false);

    function getFlexBasis(): string | undefined {
        if (!flexBasis) return undefined;
        switch (flexBasis) {
            case SegmentWidth.None:
                return '0';
            case SegmentWidth.Third:
                return `calc(100% * (1 / 3) - ${PAGE_ELEMENT_GAP})`;
            case SegmentWidth.Half:
                return `calc(100% * (1 / 2) - ${PAGE_ELEMENT_GAP})`;
            case SegmentWidth.Full:
                return `calc(100%)`;
            default:
                return flexBasis;
        }
    }

    return (<SegmentWrapper flexGrow={flexGrow} flexBasis={getFlexBasis()}>

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

const SegmentWrapper = styled.div<{ flexGrow?: number | string, flexBasis?: string }>`
    flex-grow: ${props => props.flexGrow || 2};
    flex-basis: ${props => props.flexBasis || '0'};
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
