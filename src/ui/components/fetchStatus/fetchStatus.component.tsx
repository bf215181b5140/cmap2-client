import React, { useContext } from 'react';
import styled from 'styled-components';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FetchStatusContext } from '../context/fetchStatus.context';

export function FetchStatusComponent() {

  const [parent] = useAutoAnimate();
  const { fetchStatusRequests, fetchStatusIcon } = useContext(FetchStatusContext);

  return (<>
    {fetchStatusRequests.length > 0 && <FetchStatusComponentStyled ref={parent}>
      {fetchStatusRequests.map(request => <div key={request.id}><i className={fetchStatusIcon(request.type)} /></div>)}
    </FetchStatusComponentStyled>}
  </>);
}

const FetchStatusComponentStyled = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 102;
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 50px;
    justify-content: center;
    background: #00000044;
    animation: show 1s;

    > div {
        pointer-events: none;
        width: min-content;
        height: min-content;
        background: #00000044;
        box-shadow: 0 0 60px 60px #00000044;

        i {
            font-size: 50px;
            animation: blinking 0.5s alternate infinite;

            @keyframes blinking {
                0% {
                    color: ${props => props.theme.colors.font.textBright};
                }
                100% {
                    color: ${props => props.theme.colors.font.textActive};
                }
            }
        }
    }

    @keyframes show {
        0% {
            filter: opacity(0);
        }
        100% {
            filter: opacity(1);
        }
    }
`;
