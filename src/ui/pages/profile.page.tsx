import styled from 'styled-components';
import ContentBox from '../components/contentBox.component';
import FormBuilderComponent from '../components/form/formBuilder.component';
import { useEffect } from 'react';
import { FormMeta } from 'cmap2-shared';

export default function ProfilePage() {

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/api/form/profile/soawkward', {method: 'GET'});
            const resData = await res.json() as FormMeta;
            console.log('Recieved data from server for form: ', resData);
        };
        fetchData();
    }, []);

    return (
        <ProfilePageStyled>
            <ContentBox flex={1}><img src={''} alt="Profile picture" /></ContentBox>
            <ContentBox>
                {/* <FormBuilderComponent formName={'profile'} showLabel={true} /> */}
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
