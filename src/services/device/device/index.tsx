/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, POST, DELETE } from '@src/fetchUtil/fetchUtil';

export const getDevices = (params:any) =>
  GET('getDevices', null, params, false);

export const getDevicesDetail = (params:any) =>
  GET('getDevicesDetail', null, params, false);

export const addDevices = (body:any) =>
  POST('addDevices', body, null, false);

export const delDevices = (body:any, params:any) =>
  DELETE('delDevices', body, params, false);

export const getFlavor = ( params:any) =>
  GET('getFlavor', null, params, false);
// export const getDevicesSum = () =>
//   GET('getDevicesSum', null, null, false);
