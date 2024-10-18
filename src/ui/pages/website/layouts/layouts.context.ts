import { createContext, Dispatch } from 'react';
import { useLayoutsPage } from './layouts.hook';
import { ButtonDTO, GroupDTO, LayoutDTO, LayoutsPageDTO } from 'cmap2-shared';
import { LayoutsReducerAction } from './layouts.reducer';

export interface LayoutsPageData extends ReturnType<typeof useLayoutsPage> {
  client: LayoutsPageDTO;
}

export const LayoutsPageContext = createContext<LayoutsPageData>(undefined!);
