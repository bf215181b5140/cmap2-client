import styled, { css } from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import { ReactProps } from '../../../../shared/global';
import { InputType } from 'cmap2-shared';
import { FieldOption } from 'cmap2-shared';
import Icon from 'cmap2-shared/dist/components/icon.component';

interface FormInputProps extends ReactProps {
    type: InputType;
    name?: string;
    register?: any;
    errors?: any;
    options?: FieldOption[] | null;
    value?: string;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
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

    function booleanClick(id: string) {
        console.log('clocking', id)
        const input = document.getElementById(id);
        if (input) input.click();
    }

    switch (props.type) {
        case InputType.Text:
        case InputType.Password:
        case InputType.Url:
            return (<>
                <InputStyled type={props.type} {...props.register(props.name)} readOnly={props.readOnly === true} placeholder={props.placeholder}
                             errors={hasErrors()} />
                <ErrorMessage />
            </>);
        case InputType.Number:
            return (<>
                <InputStyled type={props.type} {...props.register(props.name, {
                    setValueAs: (v: string) => v === '' ? undefined : parseInt(v),
                })} readOnly={props.readOnly === true} placeholder={props.placeholder} errors={hasErrors()} />
                <ErrorMessage />
            </>);
        case InputType.Textarea:
            return (<>
                <TextareaStyled {...props.register(props.name)} errors={hasErrors()}>
                    {props.children}
                </TextareaStyled>
                <ErrorMessage />
            </>);
        case InputType.Boolean:
            return (<>
                <CheckboxStyled errors={hasErrors()}>
                    <input type={InputType.Checkbox} {...props.register(props.name)} id={props.name + '-booleanInput'} />
                    <div onClick={() => booleanClick(props.name + '-booleanInput')}>
                        <Icon icon="ri-check-fill" />
                    </div>
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
            return (<InputStyled type={InputType.Submit} button={true} value={props.value ? props.value : 'Save'} />);
        case InputType.Button:
            return (<InputStyled type={InputType.Button} button={true} value={props.value} onClick={props.onClick} />);
        case InputType.Hidden:
            return (<><InputStyled type={props.type} /><ErrorMessage /></>);
        default:
            return (<></>);
    }
}

export const globalInputStyle = css<{ errors?: boolean }>`
  font-family: Dosis-Bold, sans-serif;
  font-size: 1em;
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

  :disabled {
    pointer-events: none;
    filter: saturate(0.5%);
  }
`;

const InputStyled = styled.input<{ button?: boolean, errors?: boolean }>`
  ${globalInputStyle};
  ${props => props.button ? 'width: auto;' : null};

  :hover {
    transform: ${props => props.button ? 'scale(1.05) perspective(1px)' : 'none'};
  }

  &[type=text]:read-only, &[type=number]:read-only {
    pointer-events: none;
    filter: saturate(0.5%);
  }
`;

const TextareaStyled = styled.textarea<{ errors?: boolean }>`
  ${globalInputStyle};
`;

const SelectStyled = styled.select<{ errors?: boolean }>`
  ${globalInputStyle};
`;

const CheckboxStyled = styled.span<{ errors?: boolean }>`
  input[type=checkbox] {
    display: none;
  }
  
  div {
    ${globalInputStyle};
    width: fit-content;
    cursor: pointer;
    padding: 0;
  }

  div i {
    font-size: 2em;
    visibility: hidden;
  }

  input[type=checkbox]:checked ~ div i {
    visibility: visible;
  }
`;

const ErrorStyled = styled.div`
  margin: -6px 10px 0 10px;
  font-size: 12px;
  text-align: center;
  color: ${colors['error']};
`;

