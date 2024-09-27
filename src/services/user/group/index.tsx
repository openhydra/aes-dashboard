/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, POST, PUT, DELETE } from '@src/fetchUtil/fetchUtil';

export const getGroup = (params:any) =>
  GET('getGroup', null, params, false);

export const getGroupSumCount = (params:any) =>
  GET('getGroupSumCount', null, params, false);

export const getUsersInGroup = (params:any) =>
  GET('getUsersInGroup', null, params, false);

export const getUsersNotInGroup = (params:any) =>
  GET('getUsersNotInGroup', null, params, false);

export const addGroup = (body:any) =>
  POST('addGroup', body, null, false);

export const delGroup = (params:any) =>
  DELETE('delGroup', null, params, false);

export const delUsersInGroup = (params:any) =>
  DELETE('delUsersInGroup', null, params, false);

export const updateGroup = (body:any, params:any) =>
  PUT('updateGroup', body, params, false);

export const addUsersToGroup = (body:any, params:any) =>
  PUT('addUsersToGroup', body, params, false);
