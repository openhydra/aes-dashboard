/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET } from '@src/fetchUtil/fetchUtil';

export const getDevicesDetail = (params:any) =>
  GET('getDevicesDetail', null, params, false);

export const getDefaultSetting = (params:any) =>
  GET('getDefaultSetting', null, params, false);

