import { ParameterDto, ReactProps } from "cmap2-shared";
import { ContentBox } from "cmap2-shared/src/components/contentBox.component";

interface ParametersProps extends ReactProps {
    parameters: ParameterDto[];
    avatarId: string;
}

export default function Parameters({parameters, avatarId}: ParametersProps) {

    const { register, control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            test: [{ firstName: "Bill", lastName: "Luo" }]
        }
    });
    const {
        fields,
        append,
        prepend,
        remove,
        swap,
        move,
        insert,
        replace
    } = useFieldArray({
        control,
        name: "test"
    });

    return(<ContentBox title='Parameters'>
        <p><span>Optional</span> list of parameters this avatar supports. Makes it easier to build button by letting you pick parameters from a list</p>

    </ContentBox>);
}
