import { Toy, ToyCommand } from 'lovense';
import ActionButton from '../../../shared/components/actionButton.component';
import FormTable from '../../../shared/components/form/formTable.component';
import FormInput from '../../../shared/components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import { SocketConnectionType } from '../../../../shared/SocketConnection';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { useEffect } from 'react';

interface LovenseToyProps {
    toy: Toy,
}

export function LovenseToy({toy}: LovenseToyProps) {

    const {register, setValue, reset, formState: {errors}, handleSubmit} = useForm({
        resolver: zodResolver(z.object({
            action: z.string(),
            timeSec: z.number()
        }))
    });

    function onSubmit(formData: any) {
        const toyCommand: ToyCommand = {...formData, command: 'Function', toy: toy.id, apiVer: 1};
        window.electronAPI.sendLovenseToyCommand(toyCommand);
    }

    function sendTestCommand() {
        const toyCommand: ToyCommand = {
            command: 'Function',
            action: 'Vibrate:' + Math.floor(Math.random() * 15) + 5,
            timeSec: Math.floor(Math.random() * 4) + 2,
            toy: toy.id,
            apiVer: 1
        };
        window.electronAPI.sendLovenseToyCommand(toyCommand);
    }

    return (
        <div>
            <h1>{toy.name}</h1>
            {toy.battery}% battery
            <ActionButton action={sendTestCommand}>Send random test command</ActionButton>

            <form onSubmit={handleSubmit(onSubmit)}>
                <FormTable>
                    <tr>
                        <th>Action</th>
                        <td><FormInput type={InputType.Text} register={register} name={'action'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <th>TimeSec</th>
                        <td><FormInput type={InputType.Number} register={register} name={'timeSec'} errors={errors} /></td>
                    </tr>
                    <tr>
                        <td colSpan={2}><FormInput type={InputType.Submit} value={'Send command'} /></td>
                    </tr>
                </FormTable>
            </form>
        </div>
    );
}
