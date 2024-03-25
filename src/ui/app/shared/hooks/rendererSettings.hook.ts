import React, { useEffect, useReducer } from 'react';
import { RendererSettings, RendererSettingsContentBox, rendererSettingsStoreDefaults } from '../../../../shared/store/main';

export type RendererSettingsReducerAction =
    { type: 'setRendererSettings', setting: RendererSettings } |
    { type: 'setContentBoxSetting', setting: RendererSettingsContentBox };

function rendererSettingsReducer(state: RendererSettings, action: RendererSettingsReducerAction): RendererSettings {
    let newState: RendererSettings;
    switch (action.type) {
        case 'setRendererSettings':
            console.log('setRendererSettings', action.setting)
            newState = action.setting;
            break;
        case 'setContentBoxSetting':
            console.log('setContentBoxSetting', action.setting)
            const contentBox = state.contentBox.find(box => box.code === action.setting.code);
            if (contentBox) {
                contentBox.isShown = action.setting.isShown;
                newState = { ...state };
                break;
            } else {
                state.contentBox.push({ ...action.setting });
                newState = { ...state };
                break;
            }
    }
    // Update the state and send new state (settings) to electron store
    window.electronAPI.send('setRendererSettings', newState);
    return newState;
}

export interface RendererSettingsHook {
    rendererSettings: RendererSettings;
    rendererSettingsDispatch: React.Dispatch<RendererSettingsReducerAction>;
}

export const RendererSettingsContext = React.createContext<RendererSettingsHook>({
    rendererSettings: rendererSettingsStoreDefaults,
    rendererSettingsDispatch: () => {}
});

export default function useRendererSettings(): RendererSettingsHook {

    const [rendererSettings, rendererSettingsDispatch] = useReducer(rendererSettingsReducer, rendererSettingsStoreDefaults);

    useEffect(() => {
        window.electronAPI.get('getRendererSettings').then(data => rendererSettingsDispatch({ type: 'setRendererSettings', setting: data }));
    }, []);

    return { rendererSettings, rendererSettingsDispatch };
}
