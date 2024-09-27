/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, POST, DELETE, PUT } from '@src/fetchUtil/fetchUtil';

export const getRoles = (params:any) =>
  GET('getRoles', null, params, false);

export const getRoleDetail = (params:any) =>
  GET('getRoleDetail', null, params, false);

export const addRoles = (body:any) =>
  POST('addRoles', body, null, false);

export const delRole = (params:any) =>
  DELETE('delRole', null, params, false);

export const updateRole = (body:any, params:any) =>
  PUT('updateRole', body, params, false);
