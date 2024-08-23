import React from 'react';
import styled from 'styled-components';
import { ReactProps } from 'cmap2-shared';

interface InfoTooltipIconProps extends ReactProps {
  title: string,
}

export default function InfoTooltipIcon({ title, children }: InfoTooltipIconProps) {
    return (<InfoTooltipIconStyled title={title}>
        {children}
        <i className="ri-question-line" />
    </InfoTooltipIconStyled>);
}

const InfoTooltipIconStyled = styled.span`
    cursor:help;
  
  i {
    font-size: 20px;
    color: ${props => props.theme.colors.info};
    margin-left: 5px;
  }
`;
