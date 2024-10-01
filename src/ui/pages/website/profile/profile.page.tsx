import React, { useState } from 'react';
import useProlfilePage from './profile.hook';
import { Page } from '../../../components/page/page.component';
import ProfileOverview from './basicInfo/overview/profileOverview.component';
import ProfileForm from './basicInfo/form/profileForm.component';
import PageMenuLink from '../../../components/menu/pageMenu/pageMenuLink.component';
import PageMenu from '../../../components/menu/pageMenu/pageMenu.component';
import styled from 'styled-components';
import { WEBSITE_URL } from '../../../../shared/const';
import InteractionKeys from './interactionKeys/interactionKeys.component';
import BackgroundPicker from './background/backgroundPicker.component';
import StylePicker from './style/stylePicker.component';
import ProfilePreview from './components/profilePreview.component';

type ProfilePageSections = 'basicInfo' | 'interactionKeys' | 'background' | 'style';

export default function ProfilePage() {

    const { profile, setBasicInfo, setImage, setInteractionKeys, setBackground, setStyle } = useProlfilePage();
    const [section, setSection] = useState<ProfilePageSections>('basicInfo')
    const pageFlexDirection = section === 'basicInfo' ? 'row' : 'column';

    if (!profile) return;

    return (<Page flexDirection={pageFlexDirection}>

        <ProfilePageMenu noMarginTop={true}>
            <div>
                <PageMenuLink onClick={() => setSection('basicInfo')} isActive={section === 'basicInfo'}>Basic info</PageMenuLink>
                <PageMenuLink onClick={() => setSection('interactionKeys')} isActive={section === 'interactionKeys'}>Interaction keys</PageMenuLink>
                <PageMenuLink onClick={() => setSection('background')} isActive={section === 'background'}>Background</PageMenuLink>
                <PageMenuLink onClick={() => setSection('style')} isActive={section === 'style'}>Style</PageMenuLink>
            </div>
            <div>
                <a id={'viewOnWebsiteLink'} href={WEBSITE_URL + '/' + profile.username} target={'_blank'}>View profile on website <i className={'ri-external-link-line'} /></a>
            </div>
        </ProfilePageMenu>

        {section === 'basicInfo' && <>
            <ProfileOverview profile={profile} setImage={setImage} />
            <ProfileForm profile={profile} setBasicInfo={setBasicInfo} />
        </>}

        {section === 'interactionKeys' && <>
            <InteractionKeys profile={profile} setInteractionKeys={setInteractionKeys} />
        </>}

        {section === 'background' && <>
            <BackgroundPicker profile={profile} setBackground={setBackground} />
            <ProfilePreview profile={profile} />
        </>}

        {section === 'style' && <>
            <StylePicker profile={profile} setStyle={setStyle} />
            <ProfilePreview profile={profile} />
        </>}

    </Page>);
}

const ProfilePageMenu = styled(PageMenu)`
    justify-content: space-between;

    div {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    #viewOnWebsiteLink {
        display: inline-block;
        background-color: ${props => props.theme.colors.buttons.info.bg};
        border: 2px solid ${props => props.theme.colors.buttons.info.bg};
        transition: 0.1s linear;
        text-decoration: none;
        padding: 8px 14px;
        font-size: 18px;
        border-radius: 7px;
        color: ${props => props.theme.colors.font.text};
        cursor: pointer;
        font-weight: normal;

        i {
            font-size: 20px;

        }

        :hover {
            background-color: ${props => props.theme.colors.buttons.info.hoverBg};
            border-color: ${props => props.theme.colors.buttons.info.hoverBorder};
        }
    }
`;


