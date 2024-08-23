import styled from 'styled-components';
import { StateBadgeDTO, StateBadgeKey } from 'cmap2-shared';
import Icon from 'cmap2-shared/src/react/components/icon.component';

interface StateBadgeComponentProps {
    badge: StateBadgeDTO;
}

export default function StateBadge({ badge }: StateBadgeComponentProps) {

    const badgeData = calculateDisplayData();

    function calculateDisplayData(): { label: string, icon: string } {
        switch (badge.key) {
            case StateBadgeKey.Afk:
                return { label: 'AFK', icon: 'ri-zzz-line' };
            case StateBadgeKey.VrMode:
                return { label: 'in VR', icon: 'ri-goggles-line' };
            case StateBadgeKey.Mute:
                return { label: 'Muted', icon: 'ri-mic-off-fill' };
            case StateBadgeKey.TrackingType:
                return { label: 'FBT', icon: 'ri-run-line' };
            case StateBadgeKey.Custom:
                return { label: badge.label, icon: badge.icon };
        }
    }

    return (<StateBadgeStyled>
        {badgeData.icon && <Icon icon={badgeData.icon} />}
        {badgeData.label}
    </StateBadgeStyled>);
}

const StateBadgeStyled = styled.span`
  display: inline-block;
  padding: 0 5px;
  margin: 0 3px;
  border-radius: 8px;
`;
