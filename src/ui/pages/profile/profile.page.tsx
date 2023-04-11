import ContentBox from '../../components/contentBox.component';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from 'cmap2-shared/dist/validationSchemas';
import FormInput from '../../components/form/formInput.component';
import { InputType } from 'cmap2-shared';
import Content from '../../components/content.component';
import useProlfilePage from './profile.hook';
import { FormTable, FormControl } from '../../components/form/formTable.component';

export default function ProfilePage() {

    const {client, clientTier, onSubmit} = useProlfilePage();
    const {register, setValue, formState: {errors}, handleSubmit} = useForm({resolver: zodResolver(profileSchema)});

    useEffect(() => {
        setValue('displayName', client?.displayName);
        setValue('bio', client?.bio);
        setValue('hidden', client?.hidden);
    }, [client]);

    return (
        <Content>
            <ContentBox flex={1} loading={!client}>
                <img src={'' + client?.picture} alt="Profile picture" />
                {clientTier && <p>{clientTier.tier}</p>}
            </ContentBox>
            <ContentBox loading={!client}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormTable>
                        <tr>
                            <th>Display name</th>
                            <td><FormInput type={InputType.Text} register={register} name={'displayName'} errors={errors} /></td>
                        </tr>
                        <tr>
                            <th>Bio</th>
                            <td><FormInput type={InputType.Textarea} register={register} name={'bio'} errors={errors} /></td>
                        </tr>
                        <tr>
                            <th>Hide profile</th>
                            <td><FormInput type={InputType.Boolean} register={register} name={'hidden'} errors={errors} /></td>
                        </tr>
                    </FormTable>
                    <FormControl><FormInput type={InputType.Submit} /></FormControl>
                </form>
            </ContentBox>
        </Content>
    );
}
