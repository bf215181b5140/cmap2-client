import { VrcOscAvatar, VrcOscAvatarSchema } from '../../../../shared/types/osc';
import { ToastType } from '../../../app/toast/toast.component';
import React, { ChangeEvent, ChangeEventHandler, RefObject, useContext, useRef, useState } from 'react';
import { ModalContext, ToastContext } from '../../../app/mainWindow/mainWindow.componenet';
import { VrcOscAvatarsReducerAction } from '../avatars.reducer';
import { useForm } from 'react-hook-form';
import ActionButton from '../../../shared/components/actionButton.component';
import SubmitInput from '../../../shared/components/form/inputs/submit.component';

interface AvatarUploadFormProps {
    avatars: VrcOscAvatar[];
    avatarsDispatch: React.Dispatch<VrcOscAvatarsReducerAction>;
}

interface AvatarUploadForm {
    file: FileList | undefined;
}

export default function AvatarUploadForm({avatars, avatarsDispatch}: AvatarUploadFormProps) {

    const toastsDispatch = useContext(ToastContext);
    const {setModal} = useContext(ModalContext);
    const {register, reset, handleSubmit} = useForm<AvatarUploadForm>({defaultValues: {file: undefined}});
    const [fileAvatar, setFileAvatar] = useState<VrcOscAvatar | undefined>(undefined);

    function onBrowse() {
        const input = document.getElementById('fileInput');
        if (input) input.click();
    }

    function onFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files?.[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result && typeof reader.result === 'string') {
                    try {
                        const tempFileAvatar = JSON.parse(reader.result) as VrcOscAvatar;
                        VrcOscAvatarSchema.parse(tempFileAvatar);
                        setFileAvatar(tempFileAvatar);
                    } catch (e) {
                        toastsDispatch({type: 'add', toast: {message: 'Not recognized as a VRChat avatar file', type: ToastType.ERROR}});
                        setFileAvatar(undefined);
                    }
                }
            };
            reader.readAsText(event.target.files[0]);
        } else {
            setFileAvatar(undefined);
        }
    }

    function onSave() {
        if (!fileAvatar) return;

        const existing = avatars.find(avatar => avatar.id === fileAvatar.id);
        if (existing) {
            setModal({
                title: `Saving ${fileAvatar.name}`,
                message: `Avatar with this ID already exists (${existing.name}), update avatar info and parameters?`,
                confirmValue: 'Update',
                confirmFunction: () => addAvatar(fileAvatar)
            });
        } else {
            addAvatar(fileAvatar);
        }
    }

    function addAvatar(avatar: VrcOscAvatar) {
        avatarsDispatch({type: 'addAvatar', avatar: avatar});
        toastsDispatch({type: 'add', toast: {message: 'Avatar saved', type: ToastType.SUCCESS}});
        clearForm();
    }

    function clearForm() {
        setFileAvatar(undefined);
        reset();
    }

    return (<form onSubmit={handleSubmit(onSave)}>
        <input type="file" id="fileInput" style={{display: 'none'}} {...register('file')} onChange={onFileChange} />

        {fileAvatar ? (
            <>
                {fileAvatar.name}
                <br />
                <SubmitInput text="Save" />
                <ActionButton action={clearForm}>Clear</ActionButton>
            </>
        ) : (
            <>
                <ActionButton action={onBrowse}>Browse</ActionButton>
            </>
        )}

    </form>);
}
