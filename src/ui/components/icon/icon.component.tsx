import styled from 'styled-components';

interface IconProps {
    icon: string;
    color?: string;
}

export default function Icon({ icon, color }: IconProps) {
    return (<IconStyled className={icon} color={color} />);
}

const IconStyled = styled.i<{ color?: string }>`
    vertical-align: text-bottom;
    margin-right: 2px;
    color: ${props => props.color ? props.color : props.theme.colors.font.icon};
`;
