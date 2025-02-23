import { createContext, Dispatch } from 'react';
import { BackgroundDTO, ParameterButtonDTO, GroupDTO, InteractionKeyDTO, LayoutDTO, ThemeDTO, TierDTO } from 'cmap2-shared';
import { LayoutsReducerAction } from './layouts.reducer';

export interface LayoutsPageData {
  tier: TierDTO;
  background: BackgroundDTO;
  theme: ThemeDTO;
  interactionKeys: InteractionKeyDTO[];
  layouts: LayoutDTO[];
  layoutsDispatch: Dispatch<LayoutsReducerAction>;
  layoutId: string | undefined;
  groupId: string | undefined;
  buttonId: string | undefined;
  layout: LayoutDTO | undefined;
  group: GroupDTO | undefined;
  parameterButton: ParameterButtonDTO | undefined;
}

export const LayoutsPageContext = createContext<LayoutsPageData>(undefined!);
