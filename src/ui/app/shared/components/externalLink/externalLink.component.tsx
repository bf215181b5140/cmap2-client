import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';

interface ExternalLinkProps extends ReactProps {
    link: string;
}

export default function ExternalLink({ link, children }: ExternalLinkProps) {

    return (<ExternalLinkStyled href={link} target={'_blank'}>
        <i className={'ri-external-link-line'} /> {children}
    </ExternalLinkStyled>);
}

const ExternalLinkStyled = styled.a`
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  color: ${props => props.theme.colors.font.textActive};
`;
