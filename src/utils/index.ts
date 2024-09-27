/**
 * @desc 此处存放一些公用的校验规则、一些公用的可转化的数据格式 、角色
 *
 * */
import * as _ from 'lodash-es';
import { useCallback, useRef } from 'react';
import stateStorage from '@src/storage/stateStorage';

/**
 * @desc Json中删除所有值为null的属性
 * @param {object} objParams - 传入参数objParams
 * */
export const RemovePropertyOfNull = (objParams: any) => {
  //重要！！！
  objParams = { ...objParams };
  Object.keys(objParams).forEach((item) => {
    if (_.isNil(objParams[item]) || objParams[item] === 'NULL') delete objParams[item];
  });
  return objParams;
};

/**
 * 适用于React的防抖hooks
 */
export function useDebounce(fn, ms) {
  const fRef = useRef<any>();
  fRef.current = fn;

  const result = useCallback(
    _.debounce(() => fRef.current(), ms),
    []
  );
  return result;
}

/**
 * @desc 16进制转rgb
 * */
// export function hexToRgba(hex, opacity = 1) {
//   let rgba =  'rgb(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5))
//     + ',' + parseInt('0x' + hex.slice(5, 7)) + ','+ opacity+')';
//   console.log(rgba)
//   return rgba
// }

export function hexToRgba(color, opacity = 1) {
  opacity = Math.max(opacity,0);
  opacity = Math.min(opacity,1);
  color = color?.replace(/\#/g,'').toUpperCase();
  if(color?.length === 3){
    let arr = color?.split('');
    color = '';
    for (let i = 0; i < arr?.length; i++) {
      color += (arr[i] + arr[i]);//将简写的3位字符补全到6位字符
    }
  }
  let num = Math.round(255 * opacity);//四舍五入
  let str = '';
  let arrHex = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];//十六进制数组
  while (num>0) {
    let mod = num % 16;
    num = (num - mod) / 16;
    str = arrHex[mod] + str;
  }
  if(str?.length == 1)str = '0' + str;
  if(str?.length == 0)str = '00';
  return `#${color+str}`;
};


/**
 * @desc permissionList 权限判断
 * @param {string} apiKeys 类型key
 * @param {number} operation 操作类型 1:查看页面/ 2:查询列表/ 4:创建/ 8:更新/ 16:删除/ 32:删除他人资源
 * @return {boolean} 是否存在KEY
 * */
export const checkUserAuth = (apiKeys: string | any, operation: number) => {
  let permission = stateStorage.get('permission') || {};
  // 系统返回的权限 & 当前功能权限 === 当前功能权限  ////表明当前功能有权限！！！
  return (permission[apiKeys] & Number(operation)) === Number(operation)
};

