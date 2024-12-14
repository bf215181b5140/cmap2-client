import styled, { css } from 'styled-components';
import expOrb from '../../../images/expOrb.png';
import ParameterSlider from './parameter.slider';
import { ButtonDTO, ImageOrientation, ThemeDTO, UsedButtonDTO } from 'cmap2-shared';

export const URL = process.env.NODE_ENV === 'production' ? 'https://changemyavatarparams.com' : 'http://localhost:8080';

interface ParameterButtonProps {
  button: ButtonDTO;
  cmapTheme: ThemeDTO;
  active?: boolean;
  disabled?: boolean;
  value?: string | number | boolean | undefined;
  useCostParameter?: { path: string, value: number };
  onClick?: (usedParameter: UsedButtonDTO) => void;
}

export default function ParameterButton(props: ParameterButtonProps) {

  function onClick(value?: string) {
    if (props.onClick) {
      switch (props.button.buttonType) {
        case 'Button':
          if (!props.active) props.onClick({ buttonId: props.button.id!, value: props.button.value! });
          break;
        case 'Toggle':
          props.onClick({ buttonId: props.button.id!, value: props.active ? props.button.valueAlt! : props.button.value! });
          break;
        case 'Slider':
          if (value === undefined) return;
          props.onClick({ buttonId: props.button.id!, value: value });
          break;
      }
    }
  }

  function useCostUsable(): boolean {
    if (props.useCostParameter && props.button.useCost) {
      return props.useCostParameter.value - props.button.useCost >= 0;
    }
    return true;
  }

  function imageUrl() {
    if (props.button.image?.urlPath.indexOf('blob:') === 0) {
      return props.button.image.urlPath;
    } else {
      return URL + '/' + props.button.image?.urlPath;
    }
  }

  if (props.button.buttonType === 'Slider') {
    return (<UseCostWrapper>
      <SliderWrapper>
        {props.button.label && <ParameterSliderLabel>{props.button.label}</ParameterSliderLabel>}
        <ParameterSlider disabled={!!props.disabled || !useCostUsable()}
                         className={props.cmapTheme.id}
                         onClick={(value: string) => onClick(value)}
                         value={typeof props.value === 'number' ? props.value : 0}
                         step={Math.abs(Number(props.button.value) - Number(props.button.valueAlt)) > 1 ? 1 : 0.01}
                         min={Number(props.button.value)}
                         max={Number(props.button.valueAlt)} />
      </SliderWrapper>
      {props.button.useCost && <UseCostIcon position="top" background={expOrb} usable={useCostUsable()}>{props.button.useCost.toString()}</UseCostIcon>}
    </UseCostWrapper>);
  }

  return (<UseCostWrapper>
    <ParameterLayoutStyled disabled={!!props.disabled || !useCostUsable()} className={`${props.cmapTheme.id} ${props.active ? 'active' : ''}`}
                           onClick={() => onClick()}>
      {props.button.image?.urlPath &&
        <ParameterButtonPicture src={imageUrl()} imageOrientation={props.button.imageOrientation || 'Square'} />}
      {props.button.label && <ParameterButtonLabel>{props.button.label}</ParameterButtonLabel>}
      <ActiveOverlay active={!!props.active} />
    </ParameterLayoutStyled>
    {props.button.useCost && <UseCostIcon position="bottom" background={expOrb} usable={useCostUsable()}>{props.button.useCost.toString()}</UseCostIcon>}
  </UseCostWrapper>);
}

function imageOrientationToAspectRatio(imageOrientation: ImageOrientation): string {
  switch (imageOrientation) {
    case 'Square':
      return '4/3';
    case 'Vertical':
      return '3/4';
    case 'Horizontal':
    default:
      return '16/9';
  }
}

const ParameterLayoutStyled = styled.div<{ disabled: boolean }>`
  text-align: center;
  padding: 0;
  min-height: 4.5em;
  min-width: 180px;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  &.vrcGreen {
    background: ${props => props.theme.colors.buttons.primary.bg};
    border: 2px solid ${props => props.theme.colors.buttons.primary.border};
    border-radius: 8px;
    transition: 0.2s linear;

    :hover, &.active {
      transform: scale(1.02) perspective(1px);
      background: ${props => props.theme.colors.buttons.primary.hoverBg};
      border: 2px solid ${props => props.theme.colors.buttons.primary.hoverBorder};
    }
  }

  &.vrcGrey {
    background: ${props => props.theme.colors.buttons.secondary.bg};
    border: 2px solid ${props => props.theme.colors.buttons.secondary.border};
    border-radius: 8px;
    transition: 0.2s linear;

    :hover, &.active {
      transform: scale(1.02) perspective(1px);
      background: ${props => props.theme.colors.buttons.secondary.hoverBg};
      border: 2px solid ${props => props.theme.colors.buttons.secondary.hoverBorder};
    }
  }

  ${props => props.disabled ? disabledParamStyle : null};
`;

const disabledParamStyle = css`
  pointer-events: none;
  cursor: initial;
  filter: saturate(0.5%);
`;

const ActiveOverlay = styled.div<{ active: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  ${props => {
  if (props.active) {
    return css`
        background: linear-gradient(45deg, transparent 0%, transparent 25%, rgba(144, 160, 164, 0.20) 50%, transparent 50%, transparent 100%) 0 0 / 400% 400%;
        animation: overlay 3s linear infinite;

        @keyframes overlay {
          from {
            background-position: 100% 0
          }
          to {
            background-position: 0 100%
          }
        }

        :after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;

          background: linear-gradient(10deg, transparent 0%, transparent 50%, rgba(144, 160, 164, 0.06) 50%, transparent 80%, transparent 100%) 0px 0px / 400% 400%;
          animation: 3s overlayAfter 2.4s linear infinite;

          @keyframes overlayAfter {
            from {
              background-position: 0 100%
            }
            to {
              background-position: 100% 0
            }
          }
        }
      `;
  }
}}
`;

const ParameterButtonLabel = styled.div`
  padding: 1.5em;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ParameterButtonPicture = styled.div<{ src: string, imageOrientation: ImageOrientation }>`
  width: 100%;
  aspect-ratio: ${props => imageOrientationToAspectRatio(props.imageOrientation)};
  margin: 0;
  padding: 0;
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
`;

const SliderWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ParameterSliderLabel = styled.div`
  padding: 5px;
  margin: 0;
  align-items: center;
`;

const UseCostWrapper = styled.div`
  position: relative;
`;

const UseCostIcon = styled.div<{ background: string, usable: boolean, position: 'top' | 'bottom' }>`
  position: absolute;
  ${props => props.position === 'top' ? css`top: 10px;` : css`bottom: 5px;`};
  right: 10px;
  padding-right: 18px;
  background: url(${props => props.background}) center right no-repeat;
  background-size: 14px;
  color: ${props => props.usable ? '#2ec92e' : '#dd3322'};
  text-shadow: 0 0 3px black;
  pointer-events: none;
`;
