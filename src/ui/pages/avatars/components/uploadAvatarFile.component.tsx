import { VrcOscAvatarSchema } from '../../../../shared/types/osc';
import { ToastType } from '../../../app/toast/toast.component';
import FileUpload from '../../../shared/components/fileUpload.component';
import { useContext } from 'react';
import { ToastContext } from '../../../app/mainWindow/mainWindow.componenet';
import ActionButton from '../../../shared/components/actionButton.component';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';

interface UploadAvatarFileProps {
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

export default function UploadAvatarFile({avatarsDispatch}: UploadAvatarFileProps) {

    const toastsDispatch = useContext(ToastContext);

    function onReadOscAvatarFile(file: FileList) {
        if (file[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    try {
                        const oscAvatarData = JSON.parse(reader.result);
                        VrcOscAvatarSchema.parse(oscAvatarData);
                        avatarsDispatch({type: 'addAvatar', avatar: oscAvatarData});
                        toastsDispatch({
                            type: 'add',
                            toast: {message: 'Avatar added', type: ToastType.SUCCESS}
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

    return (<>
        <h2>Upload</h2>
        <p>Upload your avatar file found in: C:/Users/[USER]/AppData/LocalLow/Vrchat/OSC/Avatars</p>
        <FileUpload parentType={''} parentId={''} handleUpload={onReadOscAvatarFile} />
    </>);
}
