import useCmapFetch from '../../../hooks/cmapFetch.hook';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LayoutPageDTO, LayoutPageSchema } from 'cmap2-shared';
import LayoutPage from './layout/layout.page';
import ButtonPage from './button/button.page';
import { Page } from '../../../components/page/page.component';
import LayoutSettings from './layout/settings/settings.component';

export default function LayoutsPage() {

    const { GET } = useCmapFetch();
    const { layoutId, groupId, buttonId } = useParams();

    const [client, setClient] = useState<LayoutPageDTO | undefined>();

    const layout = client?.layouts.find(l => l.id === layoutId);
    const group = layout?.groups?.find(g => g.id === groupId);
    const button = group?.buttons?.find(b => b.id === buttonId);

    useEffect(() => {
        GET('layout', LayoutPageSchema, (data) => setClient(data))
    }, []);

    if (!client) return;

    if (button) return <ButtonPage />

    return(<Page flexDirection={'column'}>

        <LayoutSettings tier={client?.tier} />

    </Page>)

    return <LayoutPage />;
}
