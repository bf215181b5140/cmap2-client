import { ReactProps } from 'cmap2-shared';
import { VrcOscAvatarParameterProperties } from '../../../../shared/types/osc';
import styled from 'styled-components';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import React, { useContext } from 'react';
import { ToastContext } from '../../../app/mainWindow/mainWindow.componenet';
import colors from 'cmap2-shared/src/colors.json';
import { ToastType } from '../../../app/toast/toast.hook';

interface AvatarParameterPropertiesProps extends ReactProps {
    type: string;
    properties?: VrcOscAvatarParameterProperties;
}

export default function AvatarParameterProperties({type, properties}: AvatarParameterPropertiesProps) {

    const toastsDispatch = useContext(ToastContext);

    function copyPath(path: string) {
        navigator.clipboard.writeText(path).then(() => {
            toastsDispatch({
                type: 'add',
                toast: {
                    message: `Copied parameter path to clipboard: ${path}`,
                    type: ToastType.INFO,
                    group: 'copyToClipboard'
                }
            });
        });
    }

    function typeColor() {
        if (type === 'input') {
            return 'darkolivegreen';
        } else if (type === 'output') {
            return 'slateblue';
        } else {
            return '';
        }
    }

    function typeIcon() {
        if (type === 'input') {
            return (<Icon icon="ri-arrow-right-line" color={typeColor()} />);
        } else if (type === 'output') {
            return (<Icon icon="ri-arrow-left-line" color={typeColor()} />);
        }
    }

    if (!properties) return (<></>);

    return (<AvatarParameterPropertiesStyled>
        <TypeStyled color={typeColor()}>{type} {typeIcon()}</TypeStyled>
        <div>
            <p>{properties?.type}</p>
            <ParameterPathStyled color={typeColor()} onClick={() => copyPath(properties.address)}>
                <i className="ri-link-m" /> {properties.address}
            </ParameterPathStyled>
        </div>
    </AvatarParameterPropertiesStyled>);
}

const AvatarParameterPropertiesStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const TypeStyled = styled.div<{ color: string }>`
  display: flex;
  flex-direction: row;
  width: 75px;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  border-right: 2px solid ${props => props.color};
`;

const ParameterPathStyled = styled.p<{ color: string }>`
  cursor: pointer;

  i {
    font-size: 16px;
    color: ${props => props.color};
  }

  :hover {
    color: ${colors['button-2-hover-border']};

    i {
      color: ${colors['button-2-hover-border']};
    }
  }
`;
