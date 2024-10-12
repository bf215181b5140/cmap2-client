import styled from 'styled-components';
import React from 'react';
import { VrcOscAvatarParameterProperties } from '../../../../../shared/objects/vrcOscAvatar';
import { useNotifications } from '../../../../hooks/useNotifications.hook';
import { theme } from '../../../../style/theme';

interface AvatarParameterPropertiesProps {
  type: 'input' | 'output';
  properties?: VrcOscAvatarParameterProperties;
}

export default function AvatarParameterProperties({ type, properties }: AvatarParameterPropertiesProps) {

  const { addNotification } = useNotifications();

  function copyPath(path: string) {
    navigator.clipboard.writeText(path).then(() => {
      addNotification('info', `Copied parameter to clipboard: ${path}`, { group: 'copyToClipboard' });
    });
  }

  if (!properties) return (<></>);

  return (<AvatarParameterPropertiesStyled>
    <TypeStyled color={color(type)}>{type} {icon(type)}</TypeStyled>
    <div>
      <p>{properties?.type}</p>
      <ParameterPathStyled color={color(type)} onClick={() => copyPath(properties.address)}>
        <i className="ri-link-m" />
        <p>{properties.address}</p>
      </ParameterPathStyled>
    </div>
  </AvatarParameterPropertiesStyled>);
}

function icon(type: string) {
  switch (type) {
    case 'input':
      return (<i className="ri-arrow-right-line" />);
    case 'output':
      return (<i className="ri-arrow-left-line" />);
  }
}

function color(type: string) {
  switch (type) {
    case 'input':
      return theme.colors.vrchat.parameterInput;
    case 'output':
      return theme.colors.vrchat.parameterOutput;
    default:
      return theme.colors.font.text;
  }
}

const AvatarParameterPropertiesStyled = styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;

    p {
        padding: 0;
        line-break: anywhere;
    }
`;

const TypeStyled = styled.div<{ color: string }>`
    display: flex;
    flex-direction: row;
    width: 75px;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    border-right: 2px solid;
    border-color: ${props => props.color};

    i {
        color: ${props => props.color};
        font-size: 20px;
    }
`;

const ParameterPathStyled = styled.div<{ color: string }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    cursor: pointer;

    i {
        font-size: 16px;
        color: ${props => props.color};
    }

    :hover {
        color: ${props => props.theme.colors.font.textActive};

        i {
            color: ${props => props.theme.colors.font.textActive};
        }
    }
`;
