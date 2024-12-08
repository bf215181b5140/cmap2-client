import React, { useState } from 'react';
import useProlfilePage from './profile.hook';
import { Page } from '../../components/page/page.component';
import ProfileOverview from './basicInfo/overview/profileOverview.component';
import ProfileForm from './basicInfo/form/profileForm.component';
import { WEBSITE_URL } from '../../../shared/const';
import InteractionKeys from './interactionKeys/interactionKeys.component';
import BackgroundPicker from './background/backgroundPicker.component';
import StylePicker from './theme/themePicker.component';
import ProfilePreview from './components/profilePreview.component';
import SectionMenu from '../../components/menu/sectionMenu/sectionMenu.component';
import NoConnection from '../../components/noConnection/noConnection.component';

type ProfilePageSections = 'basicInfo' | 'interactionKeys' | 'background' | 'theme';

export default function ProfilePage() {

  const { profile, setBasicInfo, setImage, setInteractionKeys, setBackground, setTheme } = useProlfilePage();
  const [section, setSection] = useState<ProfilePageSections>('basicInfo');
  const pageFlexDirection = section === 'basicInfo' ? 'row' : 'column';

  if (profile === undefined) return;

  if (profile === null) return <NoConnection />;

  return (<Page flexDirection={pageFlexDirection}>

    <SectionMenu>
      <div>
        <div className={'SectionMenuLink'} onClick={() => setSection('basicInfo')} aria-current={section === 'basicInfo'}>Basic info</div>
        <div className={'SectionMenuLink'} onClick={() => setSection('interactionKeys')} aria-current={section === 'interactionKeys'}>Interaction keys</div>
        <div className={'SectionMenuLink'} onClick={() => setSection('background')} aria-current={section === 'background'}>Background</div>
        <div className={'SectionMenuLink'} onClick={() => setSection('theme')} aria-current={section === 'theme'}>Theme</div>
      </div>
      <div>
        <a href={WEBSITE_URL + '/' + profile.username} target={'_blank'}>View profile on website <i className={'ri-external-link-line'} /></a>
      </div>
    </SectionMenu>

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

    {section === 'theme' && <>
      <StylePicker profile={profile} setTheme={setTheme} />
      <ProfilePreview profile={profile} />
    </>}

  </Page>);
}

