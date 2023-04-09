import { useEffect, useState } from 'react';
import { ClientDto } from 'cmap2-shared';
import useCustomFetch from '../../hooks/customFetch.hook';

export default function useProlfilePage() {

    const customFetch = useCustomFetch();
    const [client, setClient] = useState<ClientDto | null>();

    useEffect(() => {
        customFetch('profile').then(res => {
            if (res?.body) setClient(res.body);
        });
    }, []);

    const onSubmit = (formData: any) => {
        void customFetch('profile', {
            method: 'POST',
            body: JSON.stringify(formData)
        }).then(res => {
            if(res) {
                setClient({...client, ...formData});
            }
        });
    }

    return {client, onSubmit};
}
