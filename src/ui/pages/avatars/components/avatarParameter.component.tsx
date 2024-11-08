import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import AvatarParameterProperties from './avatarParameterProperties.component';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { VrcOscAvatarParameter } from '../../../../shared/objects/vrcOscAvatar';
import IconButton from '../../../components/buttons/iconButton.component';

interface AvatarParameterProps {
  avatarId: string;
  parameter: VrcOscAvatarParameter;
  avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
  forceShowProperties: boolean;
}

export default function AvatarParameter({ avatarId, parameter, avatarsDispatch, forceShowProperties }: AvatarParameterProps) {

  const [showProperties, setShowProperties] = useState<boolean>(forceShowProperties);
  const [parent] = useAutoAnimate();

  useEffect(() => {
    setShowProperties(forceShowProperties);
  }, [forceShowProperties]);

  function deleteParameter() {
    avatarsDispatch({ type: 'removeParameter', avatarId: avatarId, parameter: parameter });
  }

  return (<AvatarParameterStyled ref={parent}>

    <h4 onClick={() => setShowProperties((state) => !state)}>
      <i className={showProperties ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} /> {parameter.name}
    </h4>

    <div className={'editOptions'}>
      <IconButton role={'delete'} size={'tiny'} deleteKeyword={'parameter'} onClick={deleteParameter} />
    </div>

    {showProperties && <div className={'properties'}>
      <AvatarParameterProperties type={'input'} properties={parameter.input} />
      <AvatarParameterProperties type={'output'} properties={parameter.output} />
    </div>}

  </AvatarParameterStyled>);
}

const AvatarParameterStyled = styled.div`
    background: ${props => props.theme.colors.buttons.secondary.border};
    border-radius: 8px;
    padding: 10px 15px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: min-content;

    h4 {
        font-size: 16px;
        color: ${props => props.theme.colors.font.h4};
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
