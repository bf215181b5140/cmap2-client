import { ReactProps } from 'cmap2-shared';
import { VrcOscAvatarParameter } from '../../../../shared/types/osc';
import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import React, { useEffect, useState } from 'react';
import AvatarParameterProperties from './avatarParameterProperties.component';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import DeleteButton from '../../../shared/components/deleteButton.component';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';

interface AvatarParameterProps extends ReactProps {
    avatarId: string;
    parameter: VrcOscAvatarParameter;
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
    forceShowProperties: boolean;
    inEdit: boolean;
}

export default function AvatarParameter({avatarId, parameter, avatarsDispatch, forceShowProperties, inEdit}: AvatarParameterProps) {

    const [showProperties, setShowProperties] = useState<boolean>(forceShowProperties);
    const [parent] = useAutoAnimate();

    useEffect(() => {
        setShowProperties(forceShowProperties);
    }, [forceShowProperties]);

    function deleteParameter() {
        avatarsDispatch({type: 'removeParameter', avatarId: avatarId, parameter: parameter});
    }

    return (<AvatarParameterStyled ref={parent}>

        <h4 onClick={() => setShowProperties((state) => !state)}>
            <i className={showProperties ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} /> {parameter.name}
        </h4>

        <div className={'editOptions'}>
            {inEdit && <ParameterDeleteButton keyword={'parameter'} onClick={deleteParameter} />}
        </div>

        {showProperties && <div className={'properties'}>
            <AvatarParameterProperties type={'input'} properties={parameter.input} />
            <AvatarParameterProperties type={'output'} properties={parameter.output} />
        </div>}

    </AvatarParameterStyled>);
}

const AvatarParameterStyled = styled.div`
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
  
  .editOptions {
    position: absolute;
    top: 0;
    right: 0;
  }

  .properties {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const ParameterDeleteButton = styled(DeleteButton)`
  height: 26px;
  width: 26px;
  font-size: 16px;

  :hover {
    transform: scale(1.1);
  }
`;
