import styled from 'styled-components';
import ContentBox from '../components/contentBox.component';
import { useContext, useEffect, useState } from 'react';
import { ClientCredentialsContext } from '../App';

export default function ProfilePage() {

    const clientCredentials = useContext(ClientCredentialsContext);
    const [profileData, setProfileData] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(clientCredentials.serverUrl + '/api/profile/' + clientCredentials.username, {method: 'GET'});
            const resData = await res.json();
            console.log('Recieved /api/profile/readProfile: ', resData);
            setProfileData(resData);
        };
        fetchData();
    }, []);

    return (
        <ProfilePageStyled>
            <ContentBox flex={1}><img src={profileData?.picture} alt="Profile picture" /></ContentBox>
            <ContentBox>
                {/* {profileData?.form && <FormBuilderComponent formMeta={profileData?.form} showLabel={true} */}
                {/*                        postUrl={clientCredentials.serverUrl + '/api/profile/saveProfile/' + clientCredentials.username} />} */}
            </ContentBox>
            <ContentBox flexBasis={'100%'}>
                Donec ac enim porttitor, pretium est vel, mattis eros. Quisque et nibh ac urna hendrerit fringilla in non nulla. Sed facilisis metus
                luctus, porta nisl sit amet, feugiat est. Nullam aliquam semper elit nec rutrum. Ut at lacus ut mauris finibus varius. Nunc ultricies lacinia
                lacus, a viverra velit sodales at. In mauris purus, scelerisque ac interdum nec, condimentum nec metus.
            </ContentBox>
        </ProfilePageStyled>
    );
}

const ProfilePageStyled = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
`;
