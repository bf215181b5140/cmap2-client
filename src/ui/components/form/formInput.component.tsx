import styled from 'styled-components';
import colors from '../../style/colors.json';
import { ReactProps } from '../../../shared/global';
import { FieldType } from 'cmap2-shared';
import { Field } from 'react-hook-form';

interface FormInputProps extends ReactProps {
    label?: string | null | undefined;
    inputName?: string | null | undefined;
    inputType: string | null | undefined;
    inputValue?: string | null | undefined;
    inputPlaceholder?: string | null | undefined;
    inputOnChange?: (event: any) => void;
    inputWidth?: string;
    formProps?: any;
}

export default function FormInput({inputName, inputType, inputValue, inputPlaceholder, inputOnChange, inputWidth, formProps, children}: FormInputProps) {

    switch(inputType) {
        case FieldType.Text:
        // case FieldType.Password:
            return (<FormInputContainer fieldType={inputType}>
                <input className={"FormField"} name={inputName} type={inputType} value={inputValue} placeholder={inputPlaceholder}
                                 onChange={inputOnChange} {...formProps}>
                    {children}
                </input>
            </FormInputContainer>);
        case FieldType.Textarea:
            return (<FormInputContainer fieldType={inputType}>
                <textarea className={"FormField"} name={inputName} type={inputType} value={inputValue} placeholder={inputPlaceholder}
                                 onChange={inputOnChange} {...formProps}>
                    {children}
                </textarea>
            </FormInputContainer>);
        default:
            return(<></>);
    }
}

const FormInputContainer = styled.div<{ fieldType: FieldType }>`
  margin: 0;
  padding: 0;
  
  .FormField {
    margin: 7px;
    padding: 10px;
    color: ${colors['text-1']};
    background: ${colors['ui-primary-1']};
    border: 2px solid ${colors['ui-primary-2']};
    border-radius: 7px;
    transition: 0.15s linear;
  }

  .FormField:hover {
    transform: ${props => props.fieldType === FieldType.Submit ? 'scale(1.05) perspective(1px)' : 'none'};
    background: ${colors['ui-primary-3']};
    border: 2px solid ${colors['ui-primary-4']};
  }

  .FormField:focus-visible {
    background: ${colors['ui-primary-3']};
    border: 2px solid ${colors['ui-primary-4']};
    outline: none;
  }

  // i {
  //   color: ${colors['ui-primary-5']};
  //   float: left;
  //   font-size: 1.75em;
  //   margin: -0.12em 0 -0.12em -0.12em;
  // }
`;
