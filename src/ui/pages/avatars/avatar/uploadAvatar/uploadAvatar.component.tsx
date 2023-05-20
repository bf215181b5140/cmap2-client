import { ContentBox } from 'cmap2-shared/dist/react';
import { VRChatOscAvatar } from '../../../../../shared/interfaces';
import { ParameterDto, ReactProps } from 'cmap2-shared';
import FileUpload from '../../../../shared/components/fileUpload.component';
import { EventBus } from '../../../../shared/util/eventBus';
import { useToast } from '../../../../app/toast/toast.hook';
import { ToastType } from '../../../../app/toast/toast.component';
import { useContext } from 'react';
import { ToastContext } from '../../../../app/mainWindow/mainWindow.componenet';

interface UploadAvatarProps extends ReactProps {
    eventBus: EventBus<VRChatOscAvatar>;
}

export default function UploadAvatar({eventBus}: UploadAvatarProps) {

    const toastsDispatch = useContext(ToastContext);

    function onReadOscAvatarFile(file: FileList) {
        if (file[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    try {
                        const oscAvatarData: VRChatOscAvatar = JSON.parse(reader.result);
                        eventBus.emit('vrcAvatarData', oscAvatarData);
                        toastsDispatch({
                            type: 'add',
                            toast: {message: 'File loaded. Please review and save avatar info and parameters', type: ToastType.SUCCESS}
                        });

                    } catch (e) {
                        toastsDispatch({
                            type: 'add',
                            toast: {message: 'Not recognized as a VRChat avatar file', type: ToastType.ERROR}
                        });
                    }
                }
            };
            reader.readAsText(file[0]);
        }
    }

    return (<ContentBox flexGrow={1}>
        <p>Set up avatar by uploading the VRChat osc avatar file located in C:/Users/[USERNAME]/AppData/LocalLow/Vrchat/OSC/Avatars</p>
        <FileUpload parentType={''} parentId={''} handleUpload={onReadOscAvatarFile} />
    </ContentBox>);
}
