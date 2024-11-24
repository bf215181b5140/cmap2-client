import Segment from '../../../components/segment/segment.component';
import styled from 'styled-components';
import OscStatus from './oscStatus/oscStatus.component';
import VrcStatus from './vrcStatus/vrcStatus.component';
import SocketStatus from './socketStatus/socketStatus.component';

export default function Status() {

  return (<Segment width={'Half'}>
    <StatusesStyled>
      <VrcStatus />
      <OscStatus />
      <SocketStatus />
    </StatusesStyled>
  </Segment>);
}

const StatusesStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;