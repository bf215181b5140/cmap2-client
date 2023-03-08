import styled from 'styled-components';
import ContentBox from '../components/contentBox.component';
import { useContext, useEffect, useState } from 'react';
import { ClientCredentialsContext } from '../App';
import Content from '../components/content.component';
import colors from '../style/colors.json';

export default function AvatarPage() {

    const clientCredentials = useContext(ClientCredentialsContext);
    const [avatars, setavatars] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(clientCredentials.serverUrl + '/api/avatars/' + clientCredentials.username, {method: 'GET'});
            const resData = await res.json();
            console.log('Recieved /api/avatar/readAvatars: ', resData);
            setavatars(resData);
        };
        fetchData();
    }, []);

    return (<>
        <SidePanel>
            <h2>Avatars</h2>
            <button>KissMa</button>
            <button>Other avatar</button>
            <button className={'addButton'}><i className={'ri-add-fill'}></i></button>
        </SidePanel>
        <Content>
            <ContentBox></ContentBox>
            <ContentBox>
            </ContentBox>
            <ContentBox flexBasis={'100%'}>
                Donec ac enim porttitor, pretium est vel, mattis eros. Quisque et nibh ac urna hendrerit fringilla in non nulla. Sed facilisis metus
                luctus, porta nisl sit amet, feugiat est. Nullam aliquam semper elit nec rutrum. Ut at lacus ut mauris finibus varius. Nunc ultricies lacinia
                lacus, a viverra velit sodales at. In mauris purus, scelerisque ac interdum nec, condimentum nec metus.
            </ContentBox>
        </Content>
    </>);
}

const SidePanel = styled.div`
  margin: 0 20px 0 0;
  padding: 0 7px;
  width: 166px;
  height: 100%;
  float: left;
  background-color: ${colors['ui-background-3']};

  h2 {
    margin: 5px 5px 15px 5px;
  }

  button {
    font-family: Dosis-Bold, sans-serif;
    margin: 7px 0;
    padding: 7px;
    display: block;
    width: 100%;
    color: ${colors['text-1']};
    background: ${colors['ui-primary-1']};
    border: 2px solid ${colors['ui-primary-2']};
    border-radius: 7px;
    font-size: 16px;
    transition: 0.15s linear;

    :hover {
      //transform: scale(1.05) perspective(1px);
      background: ${colors['ui-primary-3']};
      border: 2px solid ${colors['ui-primary-4']};
    }
  }

  button.addButton {
    background: ${colors['ui-background-3']};

    i {
      font-size: 24px;
    }
  }
`;
