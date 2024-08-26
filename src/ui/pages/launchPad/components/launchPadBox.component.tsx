import { ReactProps } from 'cmap2-shared';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/icon/icon.component';

interface LaunchPadBoxProps extends ReactProps {
    icon: string;
    connected: boolean;
    redirectPath: string;
}

export default function LaunchPadBox({ icon, connected, redirectPath, children }: LaunchPadBoxProps) {

    const navigate = useNavigate();

    function redirect() {
        navigate(redirectPath);
    }

    return (<LaunchPadBoxStyled connected={connected} onClick={redirect}>
        <IconStyled>
            <Icon icon={icon} />
        </IconStyled>
        <ChildrenStyled>
            {children}
        </ChildrenStyled>
    </LaunchPadBoxStyled>);
}

const LaunchPadBoxStyled = styled.div<{ connected: boolean }>`
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
`;

const IconStyled = styled.div`
    width: 120px;
    height: 75px;
    text-align: center;
    font-size: 50px;
`;

const ChildrenStyled = styled.div`
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 5px;

    // Might need !important if this doesn't override App styles
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
`;
