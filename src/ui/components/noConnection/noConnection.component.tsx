import styled from 'styled-components';

export default function NoConnection() {
  return (<NoConnectionStyled>
    <h2>Can't connect to website</h2>
    <i className={'ri-cloud-off-line'} />
  </NoConnectionStyled>);
}

const NoConnectionStyled = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
    
    i {
        font-size: 75px;
        color: ${props => props.theme.colors.font.textInactive};
    }
`;