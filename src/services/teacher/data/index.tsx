/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, UPLOAD, DELETE } from '@src/fetchUtil/fetchUtil';

export const getDatasets = (params:any) =>
  GET('getDatasets', null, params, false);

export const getDatasetsDetail = (params:any) =>
  GET('getDatasetsDetail', null, params, false);

export const addDatasets = (body:any) =>
  UPLOAD('addDatasets', body, null, false);

export const delDatasets = (params:any) =>
  DELETE('delDatasets', null, params, false);

