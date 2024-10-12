import styled from 'styled-components';
import { ProfilePageDTO } from 'cmap2-shared';
import React from 'react';
import Segment from '../../../../components/segment/segment.component';
import { Page } from '../../../../components/page/page.component';
import Background from '../../../../components/background/background.component';

interface ProfilePreviewProps {
  profile: ProfilePageDTO;
}

export default function ProfilePreview({ profile }: ProfilePreviewProps) {

  return (<ProfilePreviewStyled>
    <div id={'profilePreviewSeparator'}>
      <i className="ri-arrow-down-s-line" />
      <hr />
      Preview
      <hr />
      <i className="ri-arrow-down-s-line" />
    </div>
    <div id={'profilePreview'}>
      <Background background={profile.background} />

      {/* TODO: these have to be LayoutComponent, GroupComponent, ButtonComponent */}
      <Page>
        <Segment segmentTitle={'Group'} width={'Third'}>

        </Segment>
        <Segment segmentTitle={'Group'} width={'Half'}>

        </Segment>
        <Segment segmentTitle={'Group'} width={'Full'}>

        </Segment>
      </Page>

    </div>
  </ProfilePreviewStyled>);
}

const ProfilePreviewStyled = styled.div`
    #profilePreviewSeparator {
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
        justify-content: center;
        color: ${props => props.theme.colors.font.text};
        margin-bottom: 6px;

        hr {
            border: 1px solid ${props => props.theme.colors.ui.contentBg};
            margin: 0;
            padding: 0;
            height: 0;
            width: 150px;
        }
    }
    
    #profilePreview {
        position: relative;
        border: 3px solid ${props => props.theme.colors.ui.contentBg};
        border-radius: 8px;
        overflow: hidden;
        padding: 40px;
        padding-top: 150px;
        
        >div:not(:first-child) {
            position: relative;
            background: ${props => props.theme.colors.ui.appBgOpaque};
            border-radius: 8px;
        }
    }
`;