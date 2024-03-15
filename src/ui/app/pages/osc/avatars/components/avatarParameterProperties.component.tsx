import { ReactProps, theme } from 'cmap2-shared';
import { VrcOscAvatarParameterProperties } from '../../../../../../shared/types/osc';
import styled, { css } from 'styled-components';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import React, { useContext } from 'react';
import { ToastContext } from '../../../../components/mainWindow/mainWindow.componenet';
import { ToastType } from '../../../../components/toast/toast.hook';

interface AvatarParameterPropertiesProps extends ReactProps {
    type: 'input' | 'output';
    properties?: VrcOscAvatarParameterProperties;
}

export default function AvatarParameterProperties({type, properties}: AvatarParameterPropertiesProps) {

    const toastsDispatch = useContext(ToastContext);

    function copyPath(path: string) {
        navigator.clipboard.writeText(path).then(() => {
            toastsDispatch({
                type: 'add',
                toast: {
                    message: `Copied parameter to clipboard: ${path}`,
                    type: ToastType.INFO,
                    group: 'copyToClipboard'
                }
            });
        });
    }

    if (!properties) return (<></>);

    return (<AvatarParameterPropertiesStyled>
        <TypeStyled $color={color(type)}>{type} {icon(type)}</TypeStyled>
        <div>
            <p>{properties?.type}</p>
            <ParameterPathStyled $color={color(type)} onClick={() => copyPath(properties.address)}>
                <i className="ri-link-m" /> {properties.address}
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
`;

const TypeStyled = styled.div<{ $color: string }>`
  display: flex;
  flex-direction: row;
  width: 75px;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  border-right: 2px solid;
  border-color: ${props => props.$color};

  i {
    color: ${props => props.$color};
    font-size: 20px;
  }
`;

const ParameterPathStyled = styled.p<{ $color: string }>`
  cursor: pointer;
  white-space: nowrap;

  i {
    font-size: 16px;
    color: ${props => props.$color};
  }

  :hover {
    color: ${props => props.theme.colors.font.textActive};

    i {
      color: ${props => props.theme.colors.font.textActive};
    }
  }
`;
