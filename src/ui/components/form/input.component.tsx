import styled from 'styled-components';
import colors from '../../style/colors.json';
import { ReactProps } from '../../../shared/global';

interface InputProps extends ReactProps {
    label?: string;
    inputName?: string;
    inputType: string;
    inputValue?: string;
    inputPlaceholder?: string;
    inputOnChange?: (event: any) => void;
    inputWidth?: string;
    formProps?: any;
}

export default function Input({label, inputName, inputType, inputValue, inputPlaceholder, inputOnChange, inputWidth, formProps, children}: InputProps) {

    return (<div>
        {label && <InputLabel>{label}</InputLabel>}
        <InputStyled name={inputName} type={inputType} value={inputValue} placeholder={inputPlaceholder}
                     onChange={inputOnChange} {...formProps}>
            {children}
        </InputStyled>
    </div>);
}

const InputStyled = styled.input<InputProps>`
  margin: 7px;
  padding: 10px;
  color: ${colors['text-1']};
  background: ${colors['ui-primary-1']};
  border: 2px solid ${colors['ui-primary-2']};
  border-radius: 7px;
  //font-size: 20px;
  transition: 0.15s linear;

  :hover {
    transform: ${props => props.inputType === 'submit' ? 'scale(1.05) perspective(1px)' : 'none'};
    background: ${colors['ui-primary-3']};
    border: 2px solid ${colors['ui-primary-4']};
  }

  :focus-visible {
    background: ${colors['ui-primary-3']};
    border: 2px solid ${colors['ui-primary-4']};
    outline: none;
  }

  i {
    color: ${colors['ui-primary-5']};
    float: left;
    font-size: 1.75em;
    margin: -0.12em 0 -0.12em -0.12em;
  }
`;

const InputLabel = styled.span`
font-weight: bold;
`;
