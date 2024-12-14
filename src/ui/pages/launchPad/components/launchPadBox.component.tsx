import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/icon/icon.component';
import { ReactProps } from '../../../types';

interface LaunchPadBoxProps extends ReactProps {
  icon: string;
  redirectPath: string;
}

export default function LaunchPadBox({ icon, redirectPath, children }: LaunchPadBoxProps) {

  const navigate = useNavigate();

  function redirect() {
    navigate(redirectPath);
  }

  return (<LaunchPadBoxStyled onClick={redirect}>
    <div className={'launchPadBoxIcon'}>
      <Icon icon={icon} />
    </div>
    <div className={'launchPadBoxContent'}>
      {children}
    </div>
  </LaunchPadBoxStyled>);
}

const LaunchPadBoxStyled = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.theme.colors.ui.contentBg};
    border: 2px solid ${props => props.theme.colors.buttons.primary.border};
    border-radius: 8px;
    transition: 0.15s linear;
    cursor: pointer;

    :hover {
        background-color: ${props => props.theme.colors.buttons.primary.hoverBg};
        border-color: ${props => props.theme.colors.buttons.primary.hoverBorder};
    }
  
  .launchPadBoxIcon {
    width: 120px;
    height: 75px;
    text-align: center;
    font-size: 50px;
  }
  
  .launchPadBoxContent {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 5px;

    h1, h2, h3, p {
      margin: 0;
      padding: 0;
    }

    h1 {
      font-size: 20px;
    }

    h2 {
      font-size: 18px;
    }
  }
`;
