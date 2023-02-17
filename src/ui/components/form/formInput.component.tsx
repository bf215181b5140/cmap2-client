import styled from 'styled-components';
import colors from '../../style/colors.json';
import { ReactProps } from '../../../shared/global';
import { InputType } from 'cmap2-shared';
import { Field } from 'react-hook-form';
import { FieldOption, FormField } from 'cmap2-shared/src/forms';

interface FormInputProps extends ReactProps {
    name?: string;
    value?: string | number;
    type: InputType;
    // editable?: boolean;
    options?: FieldOption[] | null;

    onChange?: (event: any) => void;
    width?: string;
    placeholder?: string;
    formProps?: any;
}

export default function FormInput(props: FormInputProps) {

    switch (props.type) {
        case InputType.Text:
        case InputType.Password:
        case InputType.Url:
        case InputType.File:
            return (<FormInputContainer>
                <input className={'FormField'} type={props.type} name={props.name} value={props.value} placeholder={props.placeholder}
                       onChange={props.onChange} {...props.formProps}>
                    {props.children}
                </input>
            </FormInputContainer>);
        case InputType.Textarea:
            return (<FormInputContainer>
                <textarea className={'FormField'} name={props.name} value={props.value} placeholder={props.placeholder}
                          onChange={props.onChange} {...props.formProps}>
                    {props.children}
                </textarea>
            </FormInputContainer>);
        case InputType.Boolean:
            return (<FormInputContainer>
                {[{key: 'Y', value: 'Yes'}, {key: 'N', value: 'No'}].map(option => (
                    <>
                        <input className={'FormField'} type={InputType.Radio} name={props.name} value={option.value} id={option.key}
                               {...props.formProps} key={option.key}>
                        </input>
                        <label htmlFor={option.key} key={option.key}>{option.value}</label>
                    </>
                ))}
            </FormInputContainer>);
        case InputType.Submit:
            return (<FormInputContainer inputType={props.type}><input type={props.type} className={'FormField'} /></FormInputContainer>);
        default:
            return (<></>);
    }
}

const FormInputContainer = styled.span<{ inputType?: InputType }>`
  margin: 0;
  padding: 0;

  .FormField {
    font-family: Dosis-Bold, sans-serif;
    font-size: 16px;
    margin: 7px;
    padding: 10px;
    color: ${colors['text-1']};
    background: ${colors['ui-primary-1']};
    border: 2px solid ${colors['ui-primary-2']};
    border-radius: 7px;
    transition: 0.15s linear;
  }

  .FormField:hover {
    transform: ${props => props.inputType === InputType.Submit ? 'scale(1.05) perspective(1px)' : 'none'};
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
