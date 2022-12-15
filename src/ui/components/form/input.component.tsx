import styled from 'styled-components';
import colors from '../../style/colors.json';

interface InputProps {
    inputName: string,
    inputType: string,
    inputValue?: string,
    inputPlaceholder?: string,
    inputOnChange?: (event: any) => void,
    inputWidth?: string,
    children?: any
}

export default function Input({inputName, inputType, inputValue, inputPlaceholder, inputOnChange, inputWidth, children}: InputProps) {

    return (
        <InputStyled name={inputName} type={inputType} value={inputValue} placeholder={inputPlaceholder}
                     onChange={inputOnChange}>
            {children}
        </InputStyled>
    );
}

const InputStyled = styled.input`
  margin: 7px;
  padding: 10px;
  color: ${colors['text-1']};
  background: ${colors['ui-primary-1']};
  border: 2px solid ${colors['ui-primary-2']};
  border-radius: 7px;
  font-size: 20px;
  transition: 0.15s linear;

  :hover {
    background: ${colors['ui-primary-3']};
    border: 2px solid ${colors['ui-primary-4']};
  }

  :focus-visible {
    background: ${colors['ui-primary-3']};
    border: 2px solid ${colors['ui-primary-4']};
  }

  i {
    color: ${colors['ui-primary-5']};
    float: left;
    font-size: 1.75em;
    margin: -0.12em 0 -0.12em -0.12em;
  }
`;
