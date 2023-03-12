import styled, { css } from 'styled-components';
import colors from '../../style/colors.json';
import { ReactProps } from '../../../shared/global';
import { InputType } from 'cmap2-shared';
import { FieldOption, FormField } from 'cmap2-shared/src/forms';
import { UseFormRegister } from 'react-hook-form';

interface FormInputProps extends ReactProps {
    type: InputType;
    name?: string;
    register?: any;
    errors?: any;
    options?: FieldOption[] | null;
    value?: string;
    onClick?: () => void;
}

export default function FormInput(props: FormInputProps) {

    function hasErrors(): boolean {
        return props.name && props.errors && props.errors[props.name!];
    }

    function ErrorMessage() {
        if (hasErrors()) {
            return <ErrorStyled>{props.errors[props.name!].message?.toString()}</ErrorStyled>;
        }
        return null;
    }

    switch (props.type) {
        case InputType.Text:
        case InputType.Password:
        case InputType.Url:
        case InputType.File:
            return (<>
                <InputStyled type={props.type} {...props.register(props.name)} errors={hasErrors()} />
                <ErrorMessage />
            </>);
        case InputType.Textarea:
            return (<>
                <TextareaStyled {...props.register(props.name)} errors={hasErrors()} >
                    {props.children}
                </TextareaStyled>
                <ErrorMessage />
            </>);
        case InputType.Boolean:
            return (<>
                <CheckboxStyled errors={hasErrors()}>
                    <input type={InputType.Checkbox} {...props.register(props.name)} />
                    <i className={'ri-add-fill'}></i>
                </CheckboxStyled>
                <ErrorMessage />
            </>);
        case InputType.Select:
            return (<>
                <SelectStyled {...props.register(props.name)} errors={hasErrors()}>
                    {props.options && props.options.map((option) => (<option value={option.key}>{option.value}</option>))}
                </SelectStyled>
                <ErrorMessage />
            </>);
        case InputType.Submit:
            return (<InputStyled type={InputType.Submit} button={true} value={'Save'} />);
        case InputType.Button:
            return (<InputStyled type={InputType.Button} button={true} value={props.value} onClick={props.onClick} />);
        case InputType.Hidden:
            return (<InputStyled type={props.type} />);
        default:
            return (<></>);
    }
}

const globalStyle = css<{ errors?: boolean }>`
  font-family: Dosis-Bold, sans-serif;
  font-size: 16px;
  margin: 7px;
  padding: 10px;
  color: ${colors['text-1']};
  background: ${colors['ui-primary-1']};
  border: 2px solid ${colors['ui-primary-2']};
  border-color: ${props => props.errors ? colors['error'] : colors['ui-primary-2']};
  border-radius: 7px;
  transition: 0.15s linear;
  width: 350px;

  :hover {
    background: ${colors['ui-primary-3']};
    border-color: ${props => props.errors ? colors['error'] : colors['ui-primary-4']};
  }

  :focus-visible {
    background: ${colors['ui-primary-3']};
    border-color: ${props => props.errors ? colors['error'] : colors['ui-primary-4']};
    outline: none;
  }
`;

const InputStyled = styled.input<{ button?: boolean, errors?: boolean }>`
  ${globalStyle};
  ${props => props.button ? 'width: auto;' : null};
  
  :hover {
    transform: ${props => props.button ? 'scale(1.05) perspective(1px)' : 'none'};
  }
`;

const TextareaStyled = styled.textarea<{ errors?: boolean }>`
  ${globalStyle};
`;

const SelectStyled = styled.select<{ errors?: boolean }>`
  ${globalStyle};
`;

const CheckboxStyled = styled.span<{ errors?: boolean }>`
  ${globalStyle};
  padding: 2px;
  //height:10px;

  input[type=checkbox] {
    //visibility: hidden;
  }

  i {
    visibility: hidden;
  }

  input[type=checkbox]:checked ~ i {
    visibility: visible;
  }
`;

const ErrorStyled = styled.div`
  margin: -6px 10px 0 10px;
  font-size: 12px;
  text-align: center;
  color: ${colors['error']};
`;

