import styled, { css } from 'styled-components';
import { ButtonDto, ButtonImageOrientation, ButtonStyleDto, ButtonType, ValueType } from 'cmap2-shared';

export const URL = process.env.NODE_ENV === 'production' ? 'https://changemyavatarparams.com' : 'http://localhost:8080';

interface ParameterButtonProps {
    button: ButtonDto;
    buttonStyle: ButtonStyleDto;
    active?: boolean;
    disabled?: boolean;
    onClick?: (id: string) => void;
    flexBasis?: string;
}

export default function TestParameterButton(props: ParameterButtonProps) {

    function onClick(id: string, value?: string) {
        if (!props.active && props.onClick) props.onClick(id);
    }

    if (props.button.buttonType === ButtonType.Slider) {
        return (<ParameterSliderStyled type="range" step={1} className={props.buttonStyle.className} flexBasis={props.flexBasis} onClick={(e: any) => onClick(props.button.id, e.target.value)}
                                       min={props.button.valueType === ValueType.Float ? (Number(props.button.value) * 100) : props.button.value}
                                       max={props.button.valueType === ValueType.Float ? (Number(props.button.valueAlt) * 100) : props.button.valueAlt} />);
    }

    return (<ParameterButtonStyled flexBasis={props.flexBasis} active={!!props.active || !!props.disabled} className={props.buttonStyle.className}
                                   onClick={() => onClick(props.button.id)}>
        {props.button.image && <ParameterButtonPicture src={URL + '/' + props.button.image} imageOrientation={props.button.imageOrientation} />}
        {props.button.label && <ParameterButtonLabel>{props.button.label}</ParameterButtonLabel>}
    </ParameterButtonStyled>);
}

function imageOrientationToAspectRatio(imageOrientation: ButtonImageOrientation): string {
    switch (imageOrientation) {
        case ButtonImageOrientation.Square:
            return '4/3';
        case ButtonImageOrientation.Vertical:
            return '9/16';
        case ButtonImageOrientation.Horizontal:
        default:
            return '16/9';
    }
}

const ParameterButtonStyled = styled.div<{ flexBasis?: string, active: boolean }>`
  flex-basis: ${props => props.flexBasis ? props.flexBasis : '100%'};
  align-self: flex-start;
  text-align: center;
  padding: 0;
  min-height: 4.5em;
  min-width: 180px;
  cursor: pointer;
  overflow: hidden;

  &.buttonStyle-1 {
    background: ${props => props.theme.colors.buttonPrimary.bg};
    border: 2px solid ${props => props.theme.colors.buttonPrimary.border};
    border-radius: 8px;
    transition: 0.2s linear;

    :hover {
      transform: scale(1.02);
      background: ${props => props.theme.colors.buttonPrimary.hoverBg};
      border: 2px solid ${props => props.theme.colors.buttonPrimary.hoverBorder};
    }
  }

  &.buttonStyle-2 {
    background: ${props => props.theme.colors.buttonSecondary.bg};
    border: 2px solid ${props => props.theme.colors.buttonSecondary.border};
    border-radius: 8px;
    transition: 0.2s linear;

    :hover {
      transform: scale(1.02);
      background: ${props => props.theme.colors.buttonSecondary.hoverBg};
      border: 2px solid ${props => props.theme.colors.buttonSecondary.hoverBorder};
    }
  }

  ${props => props.active ? activeParamStyle : null};
`;

const activeParamStyle = css`
  pointer-events: none;
  cursor: initial;
  filter: saturate(0%);
`;

const ParameterButtonLabel = styled.div`
  padding: 1.5em;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ParameterButtonPicture = styled.div<{ src: string, imageOrientation: ButtonImageOrientation }>`
  width: 100%;
  aspect-ratio: ${props => imageOrientationToAspectRatio(props.imageOrientation)};
  margin: 0;
  padding: 0;
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
`;

const ParameterSliderStyled = styled.input<{ flexBasis?: string }>`
  flex-basis: ${props => props.flexBasis ? props.flexBasis : '100%'};
  align-self: flex-start;
  padding: 4px;
  height: 36px;
  min-width: 180px;
  width: 100%;
  //cursor: pointer;
  //overflow: hidden;
  border-radius: 8px;

  -webkit-appearance: none;
  background: ${props => props.theme.colors.input.bg};

  ::-webkit-slider-thumb {
    height: 26px;
    width: 20px;
    border-radius: 4px;
  }

  &.buttonStyle-1 {
      background: ${props => props.theme.colors.buttonPrimary.bg};
    border: 2px solid ${props => props.theme.colors.buttonPrimary.border};
    border-radius: 8px;

    &::-webkit-slider-thumb {
      background: ${props => props.theme.colors.buttonPrimary.border};

      :hover {
        background: ${props => props.theme.colors.buttonPrimary.hoverBorder};
      }
    }
  }

  &.buttonStyle-2 {
    background: ${props => props.theme.colors.buttonSecondary.bg};
    border: 2px solid ${props => props.theme.colors.buttonSecondary.border};
    border-radius: 8px;

    &::-webkit-slider-thumb {
      background: ${props => props.theme.colors.buttonSecondary.hoverBg};

      :hover {
        background: ${props => props.theme.colors.buttonSecondary.hoverBorder};
      }
    }
  }
`;
