import { createContext, Dispatch, SetStateAction } from 'react';
import { BackgroundDTO, InteractionKeyDTO, LayoutDTO, ThemeDTO, TierDTO, AvatarButtonDTO } from 'cmap2-shared';
import { LayoutsReducerAction } from './reducers/layouts.reducer';
import { AvatarButtonsReducerAction } from './reducers/avatarButtons.reducer';

export type LayoutSections = 'parameters' | 'presets' | 'avatars' | 'interactionKeys';

export interface LayoutsPageData {
  layoutSection: LayoutSections | undefined;
  setLayoutSection: Dispatch<SetStateAction<LayoutSections | undefined>>;
  tier: TierDTO;
  background: BackgroundDTO;
  theme: ThemeDTO;
  layouts: LayoutDTO[];
  layoutsDispatch: Dispatch<LayoutsReducerAction>;
  avatarButtons: AvatarButtonDTO[];
  avatarButtonsDispatch: Dispatch<AvatarButtonsReducerAction>;
  interactionKeys: InteractionKeyDTO[];
  setInteractionKeys: Dispatch<SetStateAction<InteractionKeyDTO[]>>;
}

export const LayoutsPageContext = createContext<LayoutsPageData>(undefined!);
