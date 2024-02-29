import styled from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import WebsiteMenuLink from './websiteMenuLink.component';

export default function WebsiteMenu() {
    return (<WebsiteMenuStyled>
        <StickyMenuStyled>
            <WebsiteMenuLink to={'/website'} icon={'ri-wifi-fill'} />
            <WebsiteMenuLink to={'/website/profile'} icon={'ri-user-fill'} />
            <WebsiteMenuLink to={'/website/avatars'} icon={'ri-contacts-book-fill'} />
            <WebsiteMenuLink to={'/website/tiers'} icon={'ri-medal-fill'} />
        </StickyMenuStyled>
    </WebsiteMenuStyled>);
}

const WebsiteMenuStyled = styled.div`
  background: ${colors['ui-background-3']};
`;

const StickyMenuStyled = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
`;
