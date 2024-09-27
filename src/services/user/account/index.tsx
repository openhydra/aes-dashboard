/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, POST, DELETE, PUT, UPLOAD } from '@src/fetchUtil/fetchUtil';

export const getAccount = (params:any) =>
  GET('getAccount', null, params, false);

export const getAccountDetail = (params:any) =>
  GET('getAccountDetail', null, params, false);

export const addAccount = (body:any) =>
  POST('addAccount', body, null, false);
export const updateAccount = (body:any, params:any) =>
  PUT('updateAccount', body, params, false);

export const delAccount = (params:any) =>
  DELETE('delAccount', null, params, false);

export const uploadAccount = (body:any) =>
  UPLOAD('uploadAccount', body, null, false);
