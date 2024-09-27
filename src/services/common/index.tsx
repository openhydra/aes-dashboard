/**
 * @AUTHOR wangshegnyun
 * @DATE 2022/6/28
 * @Description: 常用接口
 */

import { DOWNLOAD, PUT } from '@src/fetchUtil/fetchUtil';

export const downLoadFile = (body, params: any) =>
  DOWNLOAD('downloadUrl', 'post', body, params, false);

export const updateAccount = (body:any, params: any) =>
  PUT('updateAccount', body, params, false);
