import { VrcOscAvatarSchema } from '../../../../shared/types/osc';
import { ToastType } from '../../../app/toast/toast.component';
import React, { RefObject, useContext, useRef } from 'react';
import { ToastContext } from '../../../app/mainWindow/mainWindow.componenet';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { useForm } from 'react-hook-form';
import ActionButton from '../../../shared/components/actionButton.component';

interface AvatarUploadFormProps {
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

interface AvatarUploadForm {
    file: FileList
}

export default function AvatarUploadForm({avatarsDispatch}: AvatarUploadFormProps) {

    const toastsDispatch = useContext(ToastContext);
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
                        const oscAvatarData = JSON.parse(reader.result);
                        VrcOscAvatarSchema.parse(oscAvatarData);
                        avatarsDispatch({type: 'addAvatar', avatar: oscAvatarData});
                        toastsDispatch({type: 'add', toast: {message: 'Avatar added', type: ToastType.SUCCESS}});
                    } catch (e) {
                        toastsDispatch({type: 'add', toast: {message: 'Not recognized as a VRChat avatar file', type: ToastType.ERROR}});
                    }
                }
            };
            reader.readAsText(formData.file[0]);
        }
    }

    function onBrowse() {
        if (fileRef?.current) fileRef.current.click();
    }

    function onUpload() {
        if (submitRef?.current) submitRef.current.click();
    }

    function onClearFiles() {
        reset({file: undefined});
    }

    return (<form onSubmit={handleSubmit(onSubmit)}>
        <input type='file' style={{display: 'hidden'}} {...register('file')} ref={fileRef} />
        <input type='submit' style={{display: 'hidden'}} ref={submitRef} />

        {selectedFile?.name ? <>
                File name: {selectedFile?.name}
                <ActionButton action={onUpload}>Upload</ActionButton>
                <ActionButton action={onClearFiles}>Clear</ActionButton>
            </>
            : <>
                <ActionButton action={onBrowse}>Browse</ActionButton>
            </>}

    </form>);
}
