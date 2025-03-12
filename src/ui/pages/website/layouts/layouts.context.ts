import { createContext, Dispatch, SetStateAction } from 'react';
import { BackgroundDTO, ParameterButtonDTO, GroupDTO, InteractionKeyDTO, LayoutDTO, ThemeDTO, TierDTO, AvatarButtonDTO } from 'cmap2-shared';
import { LayoutsReducerAction } from './reducers/layouts.reducer';
import { AvatarButtonsReducerAction } from './reducers/avatarButtons.reducer';

export interface LayoutsPageData {
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
