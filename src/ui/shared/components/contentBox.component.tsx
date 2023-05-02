import { ReactProps } from '../../../shared/global';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';

interface ContentBoxProps extends ReactProps {
    flex?: number;
    flexBasis?: string;
    loading?: boolean;
}

export default function ContentBox(props: ContentBoxProps) {

    return (<ContentBoxStyled flex={props.flex} flexBasis={props.flexBasis}>
        {props.loading !== true ? props.children : <ContentLoading>
            <div className={'loader'}></div>
        </ContentLoading>}
    </ContentBoxStyled>);
}

const ContentBoxStyled = styled.div<ContentBoxProps>`
  background-color: ${colors['ui-background-3']};
  border-radius: 8px;
  flex: ${props => props.flex || 2};
  flex-basis: ${props => props.flexBasis || '0%'};
  padding: 15px;
  
  hr {
    border: 1px solid ${colors['app-bg-opaque']};
    margin: 0.5em 0 1em 0;
    padding: 0;
  }
  
  h2 {
    font-size: 1.4em;
    color: ${colors['font-header-2']};
    padding: 0;
    margin: 0.5em 0;
  }
  
  h3 {
    font-size: 1em;
    color: ${colors['font-text-2']};
    text-transform: uppercase;
    padding: 0;
    margin: 0.5em 0;
  }
  
  p {
    margin: 5px 0;
  }
`;

const ContentLoading = styled.div`
  border: 6px solid ${colors['text-1']};
  border-radius: 4px;
  padding: 6px;
  width: 100px;
  position: relative;
  margin: 20px auto 35px auto;

  :before {
    content: '';
    width: 21px;
    height: 15px;
    border-bottom: 6px solid ${colors['text-1']};
    border-right: 6px solid ${colors['text-1']};
    border-radius: 4px;
    position: absolute;
    bottom: -15px;
    right: 15px;
    transform: rotate(35deg);
    background-color: ${colors['ui-background-3']};
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
      box-shadow: 20px 0 ${colors['text-1']}, 40px 0 transparent, 60px 0 transparent, 80px 0 transparent, 100px 0 transparent;
    }
    40% {
      box-shadow: 20px 0 ${colors['text-1']}, 40px 0 ${colors['text-1']}, 60px 0 transparent, 80px 0 transparent, 100px 0 transparent;
    }
    60% {
      box-shadow: 20px 0 ${colors['text-1']}, 40px 0 ${colors['text-1']}, 60px 0 ${colors['text-1']}, 80px 0 transparent, 100px 0 transparent;
    }
    80% {
      box-shadow: 20px 0 ${colors['text-1']}, 40px 0 ${colors['text-1']}, 60px 0 ${colors['text-1']}, 80px 0 ${colors['text-1']}, 100px 0 transparent;
    }
    100% {
      box-shadow: 20px 0 ${colors['text-1']}, 40px 0 ${colors['text-1']}, 60px 0 ${colors['text-1']}, 80px 0 ${colors['text-1']}, 100px 0 ${colors['text-1']};
    }
  }
`;