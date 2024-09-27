/**
 * @AUTHOR zhy
 * @DATE 2022/2/11
 * @Description:
 */
import { GET, POST, DELETE, UPLOAD } from '@src/fetchUtil/fetchUtil';

export const getCourse = (params:any) =>
  GET('getCourse', null, params, false);

export const getCourseDetail = (params:any) =>
  GET('getCourseDetail', null, params, false);

export const addCourse = (body:any) =>
  UPLOAD('addCourse', body, null, false);

export const delCourse = (params:any) =>
  DELETE('delCourse', null, params, false);


