import { ParameterBadgeFormDTO, ParameterBadgeTypeSchema } from 'cmap2-shared';
import Icon from '../../../../../../components/icon/icon.component';
import styled from 'styled-components';

interface ParameterBadgePreviewProps {
  badge: ParameterBadgeFormDTO['parameterBadges'][0];
}

export default function ParameterBadgePreview({ badge }: ParameterBadgePreviewProps) {

  const badgeData = calculateDisplayData();

  function calculateDisplayData(): { label: string, icon: string } {
    switch (badge.type) {
      case ParameterBadgeTypeSchema.Enum.Afk:
        return { label: 'AFK', icon: 'ri-zzz-line' };
      case ParameterBadgeTypeSchema.Enum.VrMode:
        return { label: 'in VR', icon: 'ri-goggles-line' };
      case ParameterBadgeTypeSchema.Enum.Mute:
        return { label: 'Muted', icon: 'ri-mic-off-fill' };
      case ParameterBadgeTypeSchema.Enum.TrackingType:
        return { label: 'FBT', icon: 'ri-run-line' };
      case ParameterBadgeTypeSchema.Enum.Custom:
        return { label: badge.label.replace('{v}', badge.value), icon: badge.icon };
    }
  }

  return (<ParameterBadgePreviewStyled>
    {badgeData.icon && <Icon className={badgeData.icon} />}
    {badgeData.label}
  </ParameterBadgePreviewStyled>);
}

const ParameterBadgePreviewStyled = styled.span`
  display: inline-block;
  padding: 0 5px;
  margin: 0 3px;
  border-radius: 8px;
`;
