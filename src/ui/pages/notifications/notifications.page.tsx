import { Page } from '../../components/page/page.component';
import Segment from '../../components/segment/segment.component';
import React, { useEffect, useState } from 'react';
import { Notification } from '../../../shared/objects/notification';
import IconButton from '../../components/buttons/iconButton.component';
import styled from 'styled-components';
import SegmentTable from '../../components/segment/segmentTable.component';
import { useNotifications } from '../../hooks/useNotifications.hook';
import { InputStyled, SelectInputStyled } from '../../style/input.style';
import { NotificationType, NotificationTypeSchema } from 'cmap2-shared';

export default function NotificationsPage() {

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { notificationColor, notificationIcon } = useNotifications();

    const [typeFilter, setTypeFilter] = useState<NotificationType | string>('any');
    const [messageFilter, setMessageFilter] = useState<string>('');

    const filteredNotifications = notifications.filter(n => {
       if (typeFilter !== 'any' && n.type !== typeFilter) return false;
       if (messageFilter && !n.message.toLowerCase().includes(messageFilter.toLowerCase())) return false;
       return true;
    });

    useEffect(() => {
        window.IPC.get('getNotifications').then(notifications => setNotifications(notifications.reverse()));
    }, []);

    function deleteNotification(notification: Notification) {
        window.IPC.send('deleteNotification', notification);
        setNotifications(notifications.filter(n => n.id !== notification.id));
    }

    function clearNotifications() {
        window.IPC.send('clearNotifications');
        setNotifications([]);
    }

    return (<Page flexDirection={'column'}>
        <Segment segmentTitle={'Notifications'}>

            <FiltersStyled>
                <div>
                    Filter
                    <SelectInputStyled errors={false} width={'125px'} onChange={(event) => setTypeFilter(event.target.value)}>
                        <option value={'any'} key={'any'}>{'Any type'}</option>
                        {NotificationTypeSchema.options.map(type => (<option value={type} key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>))}
                    </SelectInputStyled>
                    <InputStyled placeholder={'Search message'} value={messageFilter} onChange={(event) => setMessageFilter(event.target.value)} />
                </div>
                <IconButton role={'delete'} size={'small'} tooltip={'Clear all'} deleteKeyword={'all notifications'} onClick={() => clearNotifications()} />
            </FiltersStyled>


            {notifications.length > 0 && <>
                <SegmentTable maxHeight={'400px'}>
                    <thead>
                    <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Id</th>
                        <th>Message</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredNotifications.map(notification => (<tr key={notification.id}>
                        <td style={{whiteSpace: 'nowrap', width: '180px'}}>
                            {notification.dateTime}
                        </td>
                        <td style={{textAlign: 'center', width: '55px'}}>
                            <NotificationIcon className={notificationIcon(notification.type)} color={notificationColor(notification.type).border} />
                        </td>
                        <td style={{width: '100px'}}>
                            {notification.id}
                        </td>
                        <td>
                            {notification.message}
                        </td>
                        <td style={{textAlign: 'center', width: '40px'}}>
                            <DeleteIconStyled role={'delete'} size={'tiny'} tooltip={false} deleteKeyword={'notification'} onClick={() => deleteNotification(notification)} />
                        </td>
                    </tr>))}
                    </tbody>
                </SegmentTable>
            </>}

        </Segment>
    </Page>);
}

const FiltersStyled = styled.div`
    margin: 0 16px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
`;

const NotificationIcon = styled.i<{ color: string }>`
    font-size: 26px;
    color: ${props => props.color};
`;

const DeleteIconStyled = styled(IconButton)`
    margin: 0;
    width: 26px;
    height: 26px;
    position: initial;
`;