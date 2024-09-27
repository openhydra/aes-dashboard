/**
 * @AUTHOR: zhy
 * @UPDATE: zhy (2022-03-16)
 * @DESCRIPTION: 创建全局的rootContext
 */
import { createContext } from 'react';

interface ContextProps {
  state: any;
  dispatch: any;
}

export const RootContext = createContext({} as ContextProps);
