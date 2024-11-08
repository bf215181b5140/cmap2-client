import styled from 'styled-components';
import { Page } from '../../components/page/page.component';
import WebsiteConnection from './websiteConnection/websiteConnection.segment';
import VrcStatus from './vrcStatus/vrcStatus.component';

export default function LaunchPadPage() {

  return (<Page flexDirection={'row'}>
    <VrcStatus />
    <WebsiteConnection />
  </Page>);
}
