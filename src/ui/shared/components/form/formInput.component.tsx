import styled, { css } from 'styled-components';
import colors from 'cmap2-shared/src/colors.json';
import { InputType, ReactProps } from 'cmap2-shared';
import { FieldOption } from 'cmap2-shared';
import Icon from 'cmap2-shared/src/react/components/icon.component';
import { globalInputStyle } from './input.style';
import useInputError from './hooks/inputError.hook';
import InputErrorMessage from './inputErrorMessage.component';

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
    width?: string;
    onClick?: () => void;
}

export default function FormInput(props: FormInputProps) {
    const [hasError, errorMessage] = useInputError(props.name, props.errors);

    function booleanClick(id: string) {
        const input = document.getElementById(id);
        if (input) input.click();
    }

    switch (props.type) {
        case InputType.Text:
        case InputType.Password:
        case InputType.Url:
            return (<>
                <InputStyled type={props.type} {...props.register(props.name)} readOnly={props.readOnly === true} placeholder={props.placeholder}
                             errors={hasError} width={props.width} />
                <InputErrorMessage errorMessage={errorMessage}/>
            </>);
        case InputType.Number:
            return (<>
                <InputStyled type={props.type} {...props.register(props.name, {
                    setValueAs: (v: string) => v === '' ? undefined : parseInt(v),
                })} readOnly={props.readOnly === true} placeholder={props.placeholder} errors={hasError} width={props.width} />
                <InputErrorMessage errorMessage={errorMessage}/>
            </>);
        case InputType.Textarea:
            return (<>
                <TextareaStyled {...props.register(props.name)} errors={hasError} width={props.width}>
                    {props.children}
                </TextareaStyled>
                <InputErrorMessage errorMessage={errorMessage}/>
            </>);
        case InputType.Boolean:
            return (<>
                <CheckboxStyled errors={hasError}>
                    <input type={InputType.Checkbox} {...props.register(props.name)} id={props.name + '-booleanInput'} />
                    <div onClick={() => booleanClick(props.name + '-booleanInput')}>
                        <Icon icon="ri-check-fill" />
                    </div>
                </CheckboxStyled>
                <InputErrorMessage errorMessage={errorMessage}/>
            </>);
        case InputType.Select:
            return (<>
                <SelectStyled {...props.register(props.name)} errors={hasError} width={props.width} className={props.readOnly ? 'readOnly' : undefined}>
                    {props.options && props.options.map((option) => (<option value={option.key} key={option.key}>{option.value}</option>))}
                </SelectStyled>
                <InputErrorMessage errorMessage={errorMessage}/>
            </>);
        case InputType.Submit:
            return (<InputStyled type={InputType.Submit} button={true} value={props.value ? props.value : 'Save'} disabled={props.disabled} />);
        case InputType.Button:
            return (<InputStyled type={InputType.Button} button={true} value={props.value} onClick={props.onClick} disabled={props.disabled} />);
        case InputType.Hidden:
            return (<><InputStyled type={props.type} /><InputErrorMessage errorMessage={errorMessage}/></>);
        default:
            return (<></>);
    }
}

const InputStyled = styled.input<{ button?: boolean, errors?: boolean, width?: string }>`
  ${globalInputStyle};
  ${props => props.button ? 'width: auto;' : null};

  :hover {
    transform: ${props => props.button ? 'scale(1.05) perspective(1px)' : 'none'};
  }

  &[type=text]:read-only, &[type=number]:read-only {
    pointer-events: none;
    filter: saturate(0%);
  }
  
  &[type=button], &[type=submit] {
    cursor: pointer;
  }
`;

const TextareaStyled = styled.textarea<{ errors?: boolean, width?: string }>`
  ${globalInputStyle};
`;

export const SelectStyled = styled.select<{ errors?: boolean, width?: string }>`
  ${globalInputStyle};
  cursor: pointer;
  
  &.readOnly {
    pointer-events: none;
    filter: saturate(0%);
  }
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

