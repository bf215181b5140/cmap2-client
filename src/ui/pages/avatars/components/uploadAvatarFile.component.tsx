import { VrcOscAvatar } from '../../../../shared/types/osc';
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
                        const oscAvatarData: VrcOscAvatar = JSON.parse(reader.result);
                        avatarsDispatch({type: 'addAvatar', avatar: oscAvatarData});
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

    function addRandomAvatar() {
        avatarsDispatch({type: 'addAvatar', avatar: {id: Math.random().toString(), name: Math.random().toString(), parameters: []}});
    }

    return (<>
        upload form
        <FileUpload parentType={''} parentId={''} handleUpload={onReadOscAvatarFile} />
        <ActionButton action={addRandomAvatar}>Add random avatar</ActionButton>
    </>);
}
