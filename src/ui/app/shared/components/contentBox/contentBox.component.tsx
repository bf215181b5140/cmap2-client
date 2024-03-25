import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { CONTENT_GAP } from './content.component';
import { ContentBoxWidth, ReactProps } from 'cmap2-shared';

interface ContentBoxProps extends ReactProps {
    title?: string;
    flexGrow?: number | string;
    flexBasis?: string | ContentBoxWidth;
    loading?: boolean;
    show?: boolean;
}

export default function ContentBox({ title, flexGrow, flexBasis, loading, show, children }: ContentBoxProps) {

    const [shown, setShown] = useState<boolean>(true);

    useEffect(() => {
        if (typeof show === 'boolean') {
            setShown(show);
        }
    }, [show]);

    function getFlexBasis(): string | undefined {
        if (!flexBasis) return undefined;
        switch(flexBasis) {
            case ContentBoxWidth.None:
                return '0';
            case ContentBoxWidth.Third:
                return `calc(100% * (1 / 3) - ${CONTENT_GAP})`;
            case ContentBoxWidth.Half:
                return `calc(100% * (1 / 2) - ${CONTENT_GAP})`;
            case ContentBoxWidth.Full:
                return `calc(100%)`;
            default:
                return flexBasis;
        }
    }

    return (<ContentBoxWrapper flexGrow={flexGrow} flexBasis={getFlexBasis()}>
        {title && <ContentBoxTitle shown={shown}>
            <h2 onClick={() => setShown(prevState => !prevState)}>
                <i className={'ri-arrow-down-s-line'} />
                {title}
            </h2>
        </ContentBoxTitle>}
        {shown && <ContentBoxStyled>
            {loading !== true ? children : <ContentLoading>
                <div className={'loader'} />
            </ContentLoading>}
        </ContentBoxStyled>}
    </ContentBoxWrapper>);
}

const ContentBoxWrapper = styled.div<{ flexGrow?: number | string, flexBasis?: string }>`
  flex-grow: ${props => props.flexGrow || 2};
  flex-basis: ${props => props.flexBasis || '0'};
`;

const ContentBoxTitle = styled.div<{ shown: boolean }>`
  color: ${props => props.theme.colors.font.h2};

  h2 {
    display: inline-block;
    font-size: 1.4em;
    padding: 0;
    margin: 5px;
    cursor: pointer;
    text-shadow: 0 0 3px black;

    i {
      display: inline-block;
      transition: transform 0.1s linear;
      transform: rotate(${props => props.shown ? '0' : '-90deg'});
    }
  }
`;

const ContentBoxStyled = styled.div`
  background-color: ${props => props.theme.colors.ui.background3};
  border-radius: 8px;
  padding: 15px;

  hr {
    border: 1px solid ${props => props.theme.colors.ui.appBgOpaque};
    margin: 0.5em 0 1em 0;
    padding: 0;
  }
  
  h1 {
    text-shadow: 0 0 3px black;
  }

  h2 {
    font-size: 1.4em;
    color: ${props => props.theme.colors.font.h2};
    padding: 0;
    margin: 0.5em 0;
    text-shadow: 0 0 3px black;
  }

  h3 {
    font-size: 1em;
    color: ${props => props.theme.colors.font.h3};
    text-transform: uppercase;
    padding: 0;
    margin: 0.5em 0;
  }

  p {
    margin: 5px 0;
  }
`;

const ContentLoading = styled.div`
  border: 6px solid ${props => props.theme.colors.font.text};
  border-radius: 4px;
  padding: 6px;
  width: 100px;
  position: relative;
  margin: 20px auto 35px auto;

  :before {
    content: '';
    width: 21px;
    height: 15px;
    border-bottom: 6px solid ${props => props.theme.colors.font.text};
    border-right: 6px solid ${props => props.theme.colors.font.text};
    border-radius: 4px;
    position: absolute;
    bottom: -15px;
    right: 15px;
    transform: rotate(35deg);
    background-color: ${props => props.theme.colors.ui.background3};
  }

  .loader {
    width: 8px;
    height: 60px;
    display: block;
    left: -14px;
    position: relative;
    border-radius: 4px;
    box-sizing: border-box;
    animation: animation 3s step-start infinite;
  }

  @keyframes animation {
    0% {
      box-shadow: 20px 0 transparent, 40px 0 transparent, 60px 0 transparent, 80px 0 transparent, 100px 0 transparent;
    }
    20% {
      box-shadow: 20px 0 ${props => props.theme.colors.font.text}, 40px 0 transparent, 60px 0 transparent, 80px 0 transparent, 100px 0 transparent;
    }
    40% {
      box-shadow: 20px 0 ${props => props.theme.colors.font.text}, 40px 0 ${props => props.theme.colors.font.text}, 60px 0 transparent, 80px 0 transparent, 100px 0 transparent;
    }
    60% {
      box-shadow: 20px 0 ${props => props.theme.colors.font.text}, 40px 0 ${props => props.theme.colors.font.text}, 60px 0 ${props => props.theme.colors.font.text}, 80px 0 transparent, 100px 0 transparent;
    }
    80% {
      box-shadow: 20px 0 ${props => props.theme.colors.font.text}, 40px 0 ${props => props.theme.colors.font.text}, 60px 0 ${props => props.theme.colors.font.text}, 80px 0 ${props => props.theme.colors.font.text}, 100px 0 transparent;
    }
    100% {
      box-shadow: 20px 0 ${props => props.theme.colors.font.text}, 40px 0 ${props => props.theme.colors.font.text}, 60px 0 ${props => props.theme.colors.font.text}, 80px 0 ${props => props.theme.colors.font.text}, 100px 0 ${props => props.theme.colors.font.text};
    }
  }
`;
