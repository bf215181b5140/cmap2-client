import { ReactProps } from 'cmap2-shared';
import { VrcOscAvatarParameter } from '../../../../shared/types/osc';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import React, { useEffect, useState } from 'react';
import AvatarParameterProperties from './avatarParameterProperties.component';

interface AvatarParameterProps extends ReactProps {
    parameter: VrcOscAvatarParameter;
    forceShowProperties: boolean;
}

export default function AvatarParameter({parameter, forceShowProperties}: AvatarParameterProps) {

    const [showProperties, setShowProperties] = useState<boolean>(forceShowProperties);

    useEffect(() => {
        setShowProperties(forceShowProperties);
    }, [forceShowProperties])

    return (<AvatarParameterStyled showProperties={showProperties}>
        <h4 onClick={() => setShowProperties((state) => !state)}><i className={showProperties ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} /> {parameter.name}</h4>
        <div>
            <AvatarParameterProperties type={'input'} properties={parameter.input} />
            <AvatarParameterProperties type={'output'} properties={parameter.output} />
        </div>
    </AvatarParameterStyled>);
}

const AvatarParameterStyled = styled.div<{ showProperties: boolean }>`
  border-left: 2px solid ${colors['button-2-border']};
  background: ${colors['button-2-border']};
  border-radius: 8px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: min-content;

  h4 {
    font-size: 1em;
    color: ${colors['font-header-2']};
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
  
  >div {
    transition: 0.25ms linear;
    display: ${props => props.showProperties ? 'flex' : 'none'};
    flex-direction: column;
    gap: 10px;
  }
`;

