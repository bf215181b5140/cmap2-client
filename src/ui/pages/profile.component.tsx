import styled from 'styled-components';
import ContentBox from '../components/contentBox.component';

export default function ProfilePage() {

    return(
        <ProfilePageStyled>
            <ContentBox><img src={""} alt="Profile picture" /></ContentBox>
        </ProfilePageStyled>
    );
}

const ProfilePageStyled = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  display:flex;
  flex-direction: row;
`;
