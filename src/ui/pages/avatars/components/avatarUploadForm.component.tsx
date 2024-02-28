import { VrcOscAvatar, VrcOscAvatarSchema } from '../../../../shared/types/osc';
import { ToastType } from '../../../app/toast/toast.component';
import React, { RefObject, useContext, useRef } from 'react';
import { ModalContext, ToastContext } from '../../../app/mainWindow/mainWindow.componenet';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { useForm } from 'react-hook-form';
import ActionButton from '../../../shared/components/actionButton.component';

interface AvatarUploadFormProps {
    avatars: VrcOscAvatar[];
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

interface AvatarUploadForm {
    file: FileList
}

export default function AvatarUploadForm({avatars, avatarsDispatch}: AvatarUploadFormProps) {

    const toastsDispatch = useContext(ToastContext);
    const {setModal} = useContext(ModalContext);
    const {register, watch, reset, handleSubmit} = useForm<AvatarUploadForm>();
    const fileRef: RefObject<HTMLInputElement> = useRef(null);
    const submitRef: RefObject<HTMLInputElement> = useRef(null);
    const selectedFile = watch('file')[0];

    function onSubmit(formData: AvatarUploadForm) {
        if (formData.file[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    try {
                        const oscAvatarData = JSON.parse(reader.result) as VrcOscAvatar;
                        VrcOscAvatarSchema.parse(oscAvatarData);

                        if (!!avatars.find(avatar => avatar.id === oscAvatarData.id)) {
                            setModal({
                                title: `${oscAvatarData.name}`,
                                message: `Avatar ${oscAvatarData.name} already exists, update avatar info and parameters?`,
                                confirmValue: 'Update',
                                confirmFunction: () => addAvatar(oscAvatarData),
                                cancelFunction: () => reset()
                            });
                        } else {
                            addAvatar(oscAvatarData);
                        }

                    } catch (e) {
                        toastsDispatch({type: 'add', toast: {message: 'Not recognized as a VRChat avatar file', type: ToastType.ERROR}});
                    }
                }
            };
            reader.readAsText(formData.file[0]);
        }
    }

    function addAvatar(avatar: VrcOscAvatar) {
        avatarsDispatch({type: 'addAvatar', avatar: avatar});
        toastsDispatch({type: 'add', toast: {message: 'Avatar added', type: ToastType.SUCCESS}});
    }

    function onBrowse() {
        if (fileRef?.current) fileRef.current.click();
    }

    function onUpload() {
        if (submitRef?.current) submitRef.current.click();
    }

    function onClearFiles() {
        reset(); // {file: undefined} ?
    }

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <input type='file' style={{display: 'hidden'}} {...register('file')} ref={fileRef} />
        <input type='submit' style={{display: 'hidden'}} ref={submitRef} />

        {selectedFile?.name ? (
            <>
                File name: {selectedFile?.name}
                <ActionButton action={onUpload}>Upload</ActionButton>
                <ActionButton action={onClearFiles}>Clear</ActionButton>
            </>
        ) : (
            <>
                <ActionButton action={onBrowse}>Browse</ActionButton>
            </>
        )}

    </form>);
}
