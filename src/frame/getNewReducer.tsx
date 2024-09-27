/**
 * @AUTHOR: zhy
 * @UPDATE: zhy (2022-03-16)
 * @DESCRIPTION: 统一处理reducer、action
 */

import ConfigsPage from '@src/pages/configs';
import ComponentsConfig from '@src/components/configs';

// 设置全局action
const ActionObj: any = {};

/**
 *
 * @desc 全局action、state生成
 *
 * */
export const rootInitState = () => {
  const initStateObj: any = {};
  [...ComponentsConfig, ...ConfigsPage].forEach((item: any) => {
    const pageIdentifier = item.pageName;
    const initStateList = item.initStateList;
    initStateObj[pageIdentifier] = initStateList;

    // 全局设置action
    ActionObj[pageIdentifier] = {};
    Object.keys(initStateList).forEach((stateKey) => {
      ActionObj[pageIdentifier][stateKey] = (payload: any) => ({
        type: pageIdentifier + '_' + stateKey,
        payload
      });
    });
  });
  return initStateObj;
};

/**
 *
 * @desc 用户操作修改state所触发的reducer
 * @param {object} state 全局state
 * @param {object} action 当前用户dispatch的action
 *
 * */
const getNewReducer = (state: any, action: any) => {
  const splitAction = action.type?.split('_');
  state[splitAction[0]][splitAction[1]] = action.payload;
  return { ...state };
};
export const rootInitReduce = (state: any, action: any) => getNewReducer(state, action);


export default ActionObj;
