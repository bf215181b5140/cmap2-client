import { createContext } from 'react';
import { useLayoutsPage } from './layouts.hook';

export const LayoutsPageContext = createContext<ReturnType<typeof useLayoutsPage>>(undefined!);
