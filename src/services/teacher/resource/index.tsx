/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, UPLOAD, DELETE } from '@src/fetchUtil/fetchUtil';

export const getClass = (params:any) =>
  GET('getClass', null, params, false);

export const getCourseDetail = (params:any) =>
  GET('getCourseDetail', null, params, false);

export const addCourse = (body:any) =>
  UPLOAD('addCourse', body, null, false);

export const delCourse = (params:any) =>
  DELETE('delCourse', null, params, false);


