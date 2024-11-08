import { createContext, Dispatch } from 'react';
import { useLayoutsPage } from './layouts.hook';
import { BackgroundDTO, ButtonDTO, GroupDTO, InteractionKeyDTO, LayoutDTO, LayoutsPageDTO, StyleDTO, TierDTO } from 'cmap2-shared';
import layoutsReducer, { LayoutsReducerAction } from './layouts.reducer';

export interface LayoutsPageData {
  tier: TierDTO;
  background: BackgroundDTO;
  style: StyleDTO;
  interactionKeys: InteractionKeyDTO[];
  layouts: LayoutDTO[];
  layoutsDispatch: Dispatch<LayoutsReducerAction>;
  layoutId: string | undefined;
  groupId: string | undefined;
  buttonId: string | undefined;
  layout: LayoutDTO | undefined;
  group: GroupDTO | undefined;
  button: ButtonDTO | undefined;
}

export const LayoutsPageContext = createContext<LayoutsPageData>(undefined!);
