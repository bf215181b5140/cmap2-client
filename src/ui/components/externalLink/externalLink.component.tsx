import { ReactProps } from '../../types';

interface ExternalLinkProps extends ReactProps {
  link: string;
}

export default function ExternalLink({ link, children }: ExternalLinkProps) {

  return (<a href={link} target={'_blank'}>
    <i className={'ri-external-link-line'} /> {children}
  </a>);
}
