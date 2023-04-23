import { ReactProps } from '../../../shared/global';
import { ButtonDto } from 'cmap2-shared';
import styled from 'styled-components';
import colors from '../../style/colors.json';
import React, { useContext } from 'react';
import { ClientCredentialsContext } from '../../App';

interface ParameterButtonProps extends ReactProps {
    button: ButtonDto;
    onClick?: () => void;
    flexBasis?: string;
}

export default function ParameterButton(props: ParameterButtonProps) {

    const clientCredentials = useContext(ClientCredentialsContext);

    function onClick() {
        if (props.onClick) props.onClick();
    }

    return (<ParameterButtonStyled onClick={() => onClick()} flexBasis={props.flexBasis}>
        {props.button.image && <div><ParameterButtonPicture src={clientCredentials.serverUrl + '/' + props.button.image} alt="Profile picture" /></div>}
        {props.button.label && <ParameterButtonLabel>{props.button.label}</ParameterButtonLabel>}
    </ParameterButtonStyled>);
}

const ParameterButtonStyled = styled.div<{ flexBasis?: string }>`
  flex-basis: ${props => props.flexBasis ? props.flexBasis : '100%'};
  background: ${colors['ui-primary-1']};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: 0.2s linear;
  max-width: 250px;
  border: 2px solid ${colors['ui-primary-1']};
  padding: 0;
  
  :hover {
    transform: scale(1.02) perspective(1px);
    background: ${colors['ui-primary-3']};
    border: 2px solid ${colors['ui-primary-4']};
  }
`;

const ParameterButtonLabel = styled.div`
  padding: 15px;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ParameterButtonPicture = styled.img`
  object-fit: cover;
  width: 100%;
  margin: 0;
  padding: 0;
  display: block;
  //max-height: 100px;
`;
