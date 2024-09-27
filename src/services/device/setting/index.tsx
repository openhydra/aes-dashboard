/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, PATCH, PUT } from '@src/fetchUtil/fetchUtil';

export const getSetting = () =>
  GET('getSetting', null, null, false);

export const getVersion = (params:any) =>
  GET('getVersion', null, params, false);

export const getLicenses = (params:any) =>
  GET('getLicenses', null, params, false);

export const updateSetting = (body:any, params:any) =>
  PATCH('updateSetting', body, params, false);

