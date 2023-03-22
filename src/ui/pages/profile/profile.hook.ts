import { useEffect, useState } from 'react';
import { AvatarDto, ClientDto, LayoutDto } from 'cmap2-shared/dist/dtos';
import useCustomFetch from '../../hooks/customFetch.hook';

export default function useProlfilePage() {

    const customFetch = useCustomFetch();
    const [client, setClient] = useState<ClientDto | null>();

    useEffect(() => {
        customFetch('profile').then(data => setClient(data));
    }, []);

    const onSubmit = (formData: any) => {
        void customFetch('profile', {
            method: 'POST',
            body: JSON.stringify(formData)
        }).then(data => {
            if(data && data === true && client) {
                client.displayName = formData.displayName;
                client.bio = formData.bio;
                client.hidden = formData.hidden;
            }
        });
    }

    return {client, onSubmit};
}
